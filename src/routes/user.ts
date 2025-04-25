import { Router, Request, Response, NextFunction } from "express";

import userController from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/",
  userController.checkTokens,
  userController.getUser,
  userController.initProfile,
  (_req: Request, res: Response, _next: NextFunction) => {

    res.status(200).json({ success: true })

  })

export default userRouter;