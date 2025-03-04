import { Request, Response, NextFunction } from "express";
// import { camelCase, snakeCase } from "change-case/keys"
// import createSupabase from "@/utils/supabase/client.ts"
import createSupabase from "@/utils/supabase/server"
import { ServerError } from "../_types/server-types";


interface PracticeSessionController {
  [middleware: string]: (req: Request, res: Response, next: NextFunction) => void
}

const practiceSessionController: PracticeSessionController = {};

practiceSessionController.getActiveSession = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { id } = req.params;

    const supabase = createSupabase({ req, res });

    const { data, error } = await supabase
      .from("practice_sessions")
      .select("id")
      .eq("status", "active")
      .eq("student_id", Number(id));

    if (error) {
      throw new Error(`Error while getting practice session: ${error.message}`)
    }

    if (!data.length) {
      return res.status(204).json("")
    }

    res.locals.clientData = data[0];

    return next();

  } catch (e) {
    console.error(e);

    const error: ServerError = {
      log: "Error in getActiveSession middleware.",
      status: 500,
      message: {
        error: `${e}`
      }
    }

    return next(error)
  }
}

practiceSessionController.initPracticeSession = async (req: Request, res: Response, next: NextFunction) => {

  try {

    const supabase = createSupabase({ req, res });

    const body = req.body as { id: number, type: "random" | "structured" };

    const { data: activeSessionData, error: activeSessionError } = await supabase
      .from("practice_sessions")
      .select("id")
      .eq("student_id", body.id)
      .eq("status", "active");

    if (activeSessionError) {
      console.error(activeSessionError.details);
      throw new Error(`Error while fetching active session data: ${activeSessionError.message}`)
    } else if (activeSessionData.length) {
      res.locals.clientData = activeSessionData[0];
      return next();
    }

    const query = {
      student_id: body.id,
      type: body.type
    }

    const { data: sessionInitData, error: sessionInitError } = await supabase
      .from("practice_sessions")
      .insert(query)
      .select("id")
      .single();

    if (sessionInitError) {
      console.error(sessionInitError.details);
      throw new Error(`Error while intializing session in DB: ${sessionInitError.message}`)
    }

    res.locals.clientData = sessionInitData;

    return next();

  } catch (e) {
    console.error(e);

    const error: ServerError = {
      log: "Error in initPracticeSession middleware.",
      status: 500,
      message: {
        error: `${e}`
      }
    }

    return next(error)
  }

}

practiceSessionController.endPracticeSession = async (req: Request, res: Response, next: NextFunction) => {

  console.log("entered endPracticeSession middleware")

  try {

    const { id } = req.params;
    const { body }: { body: { status: "inactive" | "abandoned" } } = req

    const supabase = createSupabase({ req, res });
    const { error } = await supabase
      .from("practice_sessions")
      .update({ ...body })
      .eq("id", Number(id))


    if (error) {
      console.error(error.details);
      throw new Error(`Error while ending practice session: ${error.message}`)
    }

    return res.status(200).json(`Successfully updated session ${id} to ${body.status}`);

  } catch (e) {
    console.error(e);

    const error: ServerError = {
      log: "Error in endPracticeSession middleware.",
      status: 500,
      message: {
        error: `${e}`
      }
    }

    return next(error)
  }
}

export default practiceSessionController;
