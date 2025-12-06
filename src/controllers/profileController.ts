import { Request, Response, NextFunction } from "express";
import { Tables } from "@/database.types.js";
import { camelCase, snakeCase } from "change-case/keys";
import { CamelCasedProperties, SnakeCasedProperties } from "type-fest";

import { NewProfileForm } from "../_types/client-types.js";

import createSupabase from "@/utils/supabase/server.js";

import { ServerError } from "../_types/server-types.js";

const profileController:
  { [middleware: string]: (req: Request, res: Response, next: NextFunction) => void } = {};

export type DbStudentData = Tables<"profiles">
export type DbInstructorData = Tables<"tutors">

profileController.getStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = createSupabase({ req, res });

    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("role", "student");

    if (error) {
      console.error(error);
      console.error(error.details);
      throw new Error(error.message);
    }

    // console.log("getStudents/data: ", data);

    const clientData = data.map(row => {
      return camelCase(row) as CamelCasedProperties<typeof row>
    })

    res.locals.clientData = clientData;

    return next();

  } catch (e) {

    const error: ServerError = {
      log: "profileController: Error while getting student profiles",
      status: 500,
      message: {
        error: `${e}`
      }
    }

    return next(error);
  }
};

profileController.getInstructors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = createSupabase({ req, res });

    const { data, error } = await supabase
      .from("tutors")
      .select("*");

    if (error) {
      console.error(error);
      console.error(error.details);
      throw new Error(error.message);
    }

    const clientData = data.map(row => {
      return camelCase(row) as CamelCasedProperties<typeof row>
    })

    res.locals.clientData = clientData;

    return next();


  } catch (e) {

    const error: ServerError = {
      log: "profileController: Error while getting instructor profiles",
      status: 500,
      message: {
        error: `${e}`
      }
    }

    return next(error);

  }
}

profileController.addProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const form: NewProfileForm = req.body;

    if (!form.role) {
      throw new Error("No role detected; no user added.")
    }

    // console.log(query);
    const query = snakeCase(form) as SnakeCasedProperties<typeof form>

    const supabase = createSupabase({ req, res });

    const { data, error } = await supabase
      .from("profiles")
      .insert(query)
      .select();

    if (error) {
      console.error(error);
      console.error(error.details);
      throw new Error(error.message);
    }

    const clientData = data.map((row) => {
      return camelCase(row) as CamelCasedProperties<typeof row>
    })

    res.locals.clientData = clientData[0];

    return next();

  } catch (e) {

    const error: ServerError = {
      log: "profileController: Error while adding profile to DB",
      status: 500,
      message: {
        error: `${e}`
      }
    }
    return next(error);
  }
}

profileController.addInstructor = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { name, email }: NewProfileForm = req.body;

    const supabase = createSupabase({ req, res });

    const { data, error } = await supabase
      .from("tutors")
      .insert({ name: name, email: email })
      .select();

    if (error) {
      console.error(error);
      console.error(error.details);
      throw new Error(error.message);
    }

    const clientData = data.map((row) => {
      return camelCase(row) as CamelCasedProperties<typeof row>
    })

    res.locals.clientData = clientData[0];

    return next();

  } catch (e) {

    const error: ServerError = {
      log: "profileController: Error while adding instructor to DB",
      status: 500,
      message: {
        error: `${e}`
      }
    }
    return next(error);
  }
}

profileController.linkInstructor = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { studentId, instructorId }: { studentId: number, instructorId: number } = req.body;

    const supabase = createSupabase({ req, res });

    const { data, error } = await supabase
      .from("profiles")
      .update({ "instructor_id": instructorId })
      .eq("id", studentId)
      .select()
      .single();

    if (error) {
      console.error(error);
      console.error(error.details);
      throw new Error(error.message);
    }

    const clientData = camelCase(data) as CamelCasedProperties<typeof data>

    res.locals.clientData = clientData;

    return next();

  } catch (e) {

    const error: ServerError = {
      log: "profileController: Error while linking instructor to student profile",
      status: 500,
      message: {
        error: `${e}`
      }
    }
    return next(error);
  }
}

profileController.deleteProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { id } = req.params;

    // console.log(id);

    if (!Number.parseInt(id)) {
      throw new Error("Couldn't parse ID from params");
    }

    const supabase = createSupabase({ req, res });

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", Number.parseInt(id));

    if (error) {
      console.error(error.details);
      throw new Error(error.message);
    }

  } catch (e) {

    const error: ServerError = {
      log: "profileController: Error while removing student from DB",
      status: 500,
      message: {
        error: `${e}`
      }
    }
    return next(error);

  }
}

profileController.deleteInstructor = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { id } = req.params;

    console.log(id);

    console.log(id);

    if (!Number.parseInt(id)) {
      throw new Error("Couldn't parse ID from params");
    }

    const supabase = createSupabase({ req, res });

    const id_int = Number.parseInt(id);

    const { error } = await supabase
      .from("tutors")
      .delete()
      .eq("id", id_int);

    if (error) {
      console.error(error.details);
      throw new Error(error.message);
    }

    return next();

  } catch (e) {
    const error: ServerError = {
      log: "profileController: Error while removing instructor from DB",
      status: 500,
      message: {
        error: `${e}`
      }
    }
    return next(error);

  }
}

export default profileController;