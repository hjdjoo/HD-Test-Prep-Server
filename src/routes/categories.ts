import { Request, Response, Router } from "express";
// import dbController from "../controllers/dbController";
import categoriesController from "../controllers/categoriesController";
// import userController from "../controllers/userController";
const categoriesRouter = Router();


categoriesRouter.get("/",
  categoriesController.getCategories,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);

  })

export default categoriesRouter