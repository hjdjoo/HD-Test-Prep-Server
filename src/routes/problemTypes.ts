import { Request, Response, Router } from "express";
// import dbController from "../controllers/dbController";
import problemTypesController from "../controllers/problemTypesController";
// import userController from "../controllers/userController";
const problemTypesRouter = Router();


problemTypesRouter.get("/",
  problemTypesController.getProblemTypes,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);

  })

export default problemTypesRouter