import { Request, Response, NextFunction } from "express";
import { snakeCase, camelCase } from "change-case/keys"
// import createSupabase from "@/utils/supabase/client.ts"
import createSupabase from "@/utils/supabase/server"

import { SnakeCasedProperties, CamelCasedProperties } from "type-fest"
import { decode } from "base64-arraybuffer";

// types from client
// import type { FeedbackForm, ImageData } from "@/src/features/practice/components/Practice.feedback";

import { FeedbackForm, ImageData } from "../_types/client-types";
import { Tables } from "@/database.types";

export type DbFeedbackFormData = Tables<"question_feedback">

interface FeedbackController {
  [middleware: string]: (req: Request, res: Response, next: NextFunction) => void
}

const feedbackController: FeedbackController = {};

feedbackController.getFeedbackById = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { id } = req.params;

    const supabase = createSupabase({ req, res });

    const { data, error } = await supabase
      .from("question_feedback")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (error) {
      console.error(`Nothing found for this feedback id. ${error.details}`)
      throw new Error(error.message)
    };

    const clientData = camelCase(data) as CamelCasedProperties<typeof data>;

    res.locals.clientData = clientData;

    return next();

  } catch (e) {
    console.error(e);
    return res.status(500).json(`Something went wrong while getting feedback data.`)
  }
}

feedbackController.addFeedbackImage = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { feedbackForm, imageData }:
      { feedbackForm: FeedbackForm, imageData: ImageData } = req.body

    if (!imageData || !imageData.fileData || !feedbackForm) {
      return next();
    }

    const { fileName, fileData, fileType } = imageData;

    // console.log(decode(fileData));

    const ext = fileType.replace("image/", "");

    const fileNameFull = `${fileName}.${ext}`;

    const rawFileData = fileData.replace(/^(data.*base64,)/g, "");

    console.log(fileNameFull);

    const supabase = createSupabase({ req, res });

    const { error } = await supabase
      .storage
      .from("student_feedback_files")
      .upload(fileNameFull, decode(rawFileData), {
        contentType: fileType
      });

    if (error) {
      console.error(error);
      throw new Error(error.message);
    };

    return next();

  } catch (e) {
    console.error(e);
    return res.status(500).json("Something went wrong while adding image file to storage")
  }

}

feedbackController.addFeedback = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { feedbackForm, imageData }: { feedbackForm: FeedbackForm, imageData: ImageData } = req.body;

    if (!feedbackForm) {
      return res.status(500).json("No feedback form to upload");
    }

    const supabase = createSupabase({ req, res });

    if (imageData.fileData.length) {

      const { fileName, fileType } = imageData;
      const ext = fileType.replace("image/", "");
      const fileNameFull = `${fileName}.${ext}`;

      const { data: urlData, error: urlError } = await supabase
        .storage
        .from("student_feedback_files")
        .createSignedUrl(fileNameFull, 60 * 60 * 24 * 365);

      if (urlError) {
        console.error("feedbackController/createSignedUrl/error: ", urlError);
        throw new Error(urlError.message);
      }

      feedbackForm.imageUrl = urlData.signedUrl;
    }

    const dbQuery = snakeCase(feedbackForm) as SnakeCasedProperties<typeof feedbackForm>;


    const { data, error } = await supabase
      .from("question_feedback")
      .insert(dbQuery)
      .select("id")
      .single();

    if (error) {
      console.error("feedbackController/insert/error: ", error);
      throw new Error(error.message);
    }

    res.locals.clientData = { id: data.id }

    return next();
    // const supabase = createSupabase({ req, res });
  } catch (e) {
    console.error(e);
    return res.status(500).json("Something went wrong while adding feedback to DB.")
  }

}


export default feedbackController;
