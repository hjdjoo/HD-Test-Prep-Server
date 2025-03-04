import { Request, Response, Router } from "express";
// import dbController from "../controllers/dbController";
import feedbackController from "../controllers/feedbackController";
import tagsController from "../controllers/tagsController";
import questionController from "../controllers/questionController";
// import userController from "../controllers/userController";
const feedbackRouter = Router();


feedbackRouter.get("/:id",
  feedbackController.getFeedbackById,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);

  }
)

feedbackRouter.post("/new",
  tagsController.addNewTags,
  feedbackController.addFeedbackImage,
  feedbackController.addFeedback,
  questionController.updateQuestion,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);

  })

export default feedbackRouter