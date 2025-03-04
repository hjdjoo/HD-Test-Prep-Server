import { Request, Response, Router } from "express";
// import dbController from "../controllers/dbController";
import studentResponsesController from "../controllers/studentResponsesController";
// import userController from "../controllers/userController";
const studentResponsesRouter = Router();

console.log("entering student responses router")

// studentResponsesRouter.get("/?ids=*",
//   studentResponsesController.getResponsesById,
//   (_req: Request, res: Response) => {

//     const { clientData } = res.locals;

//     res.status(200).json(clientData);

//   });

studentResponsesRouter.get("/:sessionId",
  studentResponsesController.getResponsesBySession,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);

  });

studentResponsesRouter.post("/new",
  studentResponsesController.addStudentResponse,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);

  })

export default studentResponsesRouter