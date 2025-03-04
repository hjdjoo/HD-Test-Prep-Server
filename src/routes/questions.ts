import { Request, Response, Router } from "express";
// import dbController from "../controllers/dbController";
import questionController from "../controllers/questionController";
// import userController from "../controllers/userController";
const questionRouter = Router();


questionRouter.get("/",
  questionController.getQuestions,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);

  })

export default questionRouter