import { Request, Response, NextFunction } from "express";
import { camelCase, snakeCase } from "change-case/keys"
// import createSupabase from "@/utils/supabase/client.ts"
import createSupabase from "@/utils/supabase/server"
import createServiceClient from "@/utils/supabase/service";
import { CamelCasedProperties, SnakeCasedProperties } from "type-fest"

// types from client
import type { FeedbackForm } from "../_types/client-types"
// import StudentResponse
import { Question } from "../_types/client-types";


interface QuestionController {
  [middleware: string]: (req: Request, res: Response, next: NextFunction) => void
}

const questionController: QuestionController = {};

questionController.getQuestions = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const supabase = createSupabase({ req, res });

    const { data, error } = await supabase
      .from("math_problems")
      .select("*");

    if (!data) {
      throw new Error(`Error while querying database from controller: ${error.message}`)
    }
    if (!data.length) {
      throw new Error(`No data returned from Database. Have you checked RLS policies?`)
    }

    const clientData = data.map(row => {

      return camelCase(row) as CamelCasedProperties<typeof row>

    });

    res.locals.clientData = clientData;

    return next();

  } catch (e) {
    res.status(500).json(`${e}`);
  }

}


questionController.updateQuestion = async (req: Request, res: Response, next: NextFunction) => {

  try {

    const supabase = createServiceClient();

    const { feedbackForm, question }: { feedbackForm: FeedbackForm, question: Question } = req.body

    const { tags } = feedbackForm;
    console.log("updateQuestion/tags: ", tags);

    const updatedTags = question.tags as { [key: string]: number };

    for (let tag of tags) {

      const tagString = String(tag);

      if (!updatedTags[tagString]) {
        updatedTags[tagString] = 1;
      } else {
        updatedTags[tagString] = updatedTags[tag] + 1;
      }

    };

    // question.tags = JSON.stringify(updatedTags);

    console.log("updated question: ", question);

    const dbQuery = snakeCase(question) as SnakeCasedProperties<typeof question>

    const { error } = await supabase
      .from("math_problems")
      .update(dbQuery)
      .eq("id", question.id)

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    res.locals.clientData.updatedQuestion = question;

    return next();

  } catch (e) {
    console.error(e);
    return res.status(500).json(`Something went wrong while updating question. ${e}`)
  }

}


export default questionController
