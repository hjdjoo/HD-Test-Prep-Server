import { Request, Response, NextFunction } from "express";
import { snakeCase, camelCase } from "change-case/keys"
// import createSupabase from "@/utils/supabase/client.ts"
import createSupabase from "@/utils/supabase/server.js"

import { PostgrestError } from "@supabase/supabase-js";

import { ServerError } from "../_types/server-types.js";
import { SnakeCasedProperties, CamelCasedProperties } from "type-fest"
import { decode } from "base64-arraybuffer";

// types from client
// import type { FeedbackForm, ImageData } from "@/features/practice/components/Practice.feedback";

import { FeedbackForm, ImageData } from "../_types/client-types.js";
import { Tables } from "@/database.types.js";

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
      console.error(`Nothing found for this feedback id. ${error}`)
      throw error
    };

    const clientData = camelCase(data) as CamelCasedProperties<typeof data>;

    res.locals.clientData = clientData;

    return next();

  } catch (e) {
    const sbError = e as PostgrestError;
    console.log(sbError);

    const error: ServerError = {
      log: "FeedbackController: Error while getting feedback for this id",
      status: 500,
      message: {
        error: `${sbError.message}`
      }
    }

    return next(error);

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
      throw error;
    };

    return next();

  } catch (e) {
    // return res.status(500).json("Something went wrong while adding image file to storage")
    const sbError = e as PostgrestError;

    console.log(sbError);

    const error: ServerError = {
      log: "FeedbackController: Something went wrong while adding image file to storage",
      status: 500,
      message: {
        error: `${sbError.message}`
      }
    }

    return next(error);
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

    console.log(dbQuery);


    const { data, error } = await supabase
      .from("question_feedback")
      .insert(dbQuery)
      .select("id")
      .single();

    if (error) {
      console.error("feedbackController/insert/error: ", error);
      throw error;
    }

    res.locals.clientData = { id: data.id }

    return next();
    // const supabase = createSupabase({ req, res });
  } catch (e) {
    const sbError = e as PostgrestError;

    console.log(sbError);

    const error: ServerError = {
      log: "FeedbackController: Something went wrong while adding feedback to DB.",
      status: 500,
      message: {
        error: `${sbError.message}`
      }
    }

    return next(error);
  }

}


export default feedbackController;
