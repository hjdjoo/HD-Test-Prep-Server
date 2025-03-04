import { Request, Response, Router } from "express";
import practiceSessionController from "../controllers/practiceSessionController";
// import dbController from "../controllers/dbController";
// import student

// import userController from "../controllers/userController";
const practiceSessionRouter = Router();


practiceSessionRouter.get("/:id",
  practiceSessionController.getActiveSession,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);

  })

practiceSessionRouter.post("/new",
  practiceSessionController.initPracticeSession,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);

  })


practiceSessionRouter.patch("/:id",
  practiceSessionController.endPracticeSession
)
export default practiceSessionRouter