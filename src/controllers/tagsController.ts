import { Request, Response, NextFunction } from "express";
import createSupabase from "@/utils/supabase/server"
import { FeedbackForm } from "../_types/client-types";

import { Tables } from "@/database.types";

interface TagsController {
  [middleware: string]: (req: Request, res: Response, next: NextFunction) => void
}

const tagsController: TagsController = {};


tagsController.getTags = async (req: Request, res: Response, next: NextFunction) => {

  try {

    const supabase = createSupabase({ req, res });

    const { data, error } = await supabase
      .from("tags")
      .select("*")

    if (!data) {
      throw new Error(`${error.message}`)
    }

    if (!data.length) {
      throw new Error("No rows returned from DB. Have you checked RLS policies?")
    }

    // console.log("data: ", data)
    // console.log("error: ", error)

    res.locals.tagsData = data;

    return next();

  } catch (e) {
    console.error(e);
    res.status(500).json(`Error while getting tags from DB: ${e}`)
  }

}

tagsController.getTagsById = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const query = req.query;

    const ids = query.ids as string

    if (!ids) {
      console.log("No ids to query. returning...");
      return res.status(400).json("No query detected");
    }
    console.log(ids);

    const queryIds = ids.split(",");

    const queryIdsParsed = queryIds.map(id => Number(id))

    const supabase = createSupabase({ req, res });

    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .in("id", queryIdsParsed)

    if (error) {
      console.error("tagsController/getTagsById/error details: ", error.details);
      throw new Error(error.message)
    }

    const clientData: { [id: string]: string } = {};

    data.forEach(row => {
      clientData[row.id] = row.tag_name
    })

    res.locals.clientData = clientData;

    return next();

  } catch (e) {
    console.error(e);
    res.status(500).json(`Error while getting tags by ID from DB: ${e}`)
  }

}


tagsController.addNewTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { newTags, feedbackForm }: { newTags: string[], feedbackForm: FeedbackForm } = req.body;

    console.log("dbController/addNewTags/newTags: ", newTags);

    if (!newTags || !newTags.length) {
      return next();
    }

    const supabase = createSupabase({ req, res });

    const query = newTags.map(tag => {
      return { tag_name: tag }
    })

    const { data, error } = await supabase
      .from("tags")
      .insert(query)
      .select("id");

    if (error) {
      console.log("tagsController/error: ");
      console.error(error.message);
      console.error(error.details);
      return res.status(500).json(`Error while adding new tags to DB. ${error.message}`)
    }

    if (!data.length) {
      return res.status(500).json("No rows returned from DB. Check RLS Policies")
    }

    console.log("tag data: ", data);

    const newTagIds = data.map(row => {
      return row.id;
    })

    feedbackForm.tags = feedbackForm.tags.concat(newTagIds);

    // console.log(feedbackForm.tags);
    console.log("request body feedback form: ", req.body.feedbackForm);

    return next();
  } catch (e) {
    console.error(e);
    return res.status(500).json(`${e}`);
  }

}


tagsController.addTag = async (req: Request, res: Response, _next: NextFunction) => {

  try {

    const supabase = createSupabase({ req, res });

    const tag: { name: string } = req.body;

    console.log(tag);

    const { data, error } = await supabase
      .from("tags")
      .insert({ tag_name: tag.name })
      .select("id")
      .single();

    if (!data) {
      throw new Error(`${error.message}`)
    }

    res.status(200).json(data);


  } catch (e) {

    console.error(e);
    res.status(500).json(`Error while adding tag to DB: ${e}`);
  };

}



tagsController.createTagsObj = (_req: Request, res: Response, next: NextFunction) => {

  const tagsData = res.locals.tagsData as Tables<"tags">[];

  const tagsObject: { [tag: string]: number } = {}

  tagsData.forEach(row => {
    tagsObject[row.tag_name] = row.id
  });

  delete res.locals.tagsData;

  res.locals.clientData = tagsObject;

  return next();

}



export default tagsController;
