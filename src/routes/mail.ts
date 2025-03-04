import { Router, Request, Response } from "express";

import mailController from "../controllers/mailController";

const mailRouter = Router();

mailRouter.post("/send/:id",
  mailController.extractPdf,
  mailController.uploadPdf,
  mailController.getInstructorEmail,
  mailController.sendEmail,
  (_req: Request, res: Response) => {

    const clientData = res.locals;

    res.status(200).json(clientData);

  });

export default mailRouter;