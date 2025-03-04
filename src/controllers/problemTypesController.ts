import { Request, Response, NextFunction } from "express";
import { camelCase } from "change-case/keys"
// import createSupabase from "@/utils/supabase/client.ts"
import createSupabase from "@/utils/supabase/server"
import { CamelCasedProperties } from "type-fest"

interface ProblemTypesController {
  [middleware: string]: (req: Request, res: Response, next: NextFunction) => void
}

const problemTypesController: ProblemTypesController = {};

problemTypesController.getProblemTypes = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const supabase = createSupabase({ req, res });

    const { data, error } = await supabase
      .from("problem_types")
      .select("*");

    if (!data) {
      throw new Error(`Error while querying database from controller: ${error.message}`)
    }
    if (!data.length) {
      throw new Error(`No data returned from DB. Have you checked RLS policies?`)
    }

    const clientData = data.map(row => {

      return camelCase(row) as CamelCasedProperties<typeof row>

    });

    res.locals.clientData = clientData;

    res.locals.dbData = data
    return next();

  } catch (e) {
    console.error("dbController/getProblemTypes/error: ", e);
    res.status(500).json(`${e}`);
  }
}



export default problemTypesController;