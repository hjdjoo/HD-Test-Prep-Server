import { Request, Response, NextFunction } from "express";
import { camelCase } from "change-case/keys"
// import createSupabase from "@/utils/supabase/client.ts"
import createSupabase from "@/utils/supabase/server.js"
import { CamelCasedProperties } from "type-fest"
import { ServerError } from "../_types/server-types.js";



interface CategoriesController {
  [middleware: string]: (req: Request, res: Response, next: NextFunction) => void
}

const categoriesController: CategoriesController = {};


categoriesController.getCategories = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const supabase = createSupabase({ req, res });

    const { data, error } = await supabase
      .from("categories")
      .select("*");

    if (!data) {
      throw new Error(`Error while querying database from controller: ${error.message}`)
    }
    if (!data.length) {
      throw new Error(`No data returned from Database. Have you checked RLS policies?`)
    }
    // console.log("categoriesController.getCategories/data: ", data)
    const clientData = data.map(row => {

      return camelCase(row) as CamelCasedProperties<typeof row>

    });

    res.locals.clientData = clientData;

    return next();

  } catch (e) {

    const error: ServerError = {
      log: "CategoriesController: Error while getting categories.",
      status: 500,
      message: {
        error: `${e}`
      }
    }

    return next(error);
    // res.status(500).json(`${e}`);
  }
}

export default categoriesController