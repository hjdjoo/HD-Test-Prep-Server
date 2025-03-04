import { Request, Response, Router } from "express";
// import dbController from "../controllers/dbController";
import tagsController from "../controllers/tagsController";
// import userController from "../controllers/userController";
const tagsRouter = Router();


tagsRouter.get("/all",
  tagsController.getTags,
  tagsController.createTagsObj,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);

  })

tagsRouter.get("/*",
  tagsController.getTagsById,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);

  }
)

tagsRouter.post("/tags",
  tagsController.addTag,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);

  }
)

export default tagsRouter