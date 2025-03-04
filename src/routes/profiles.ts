import { Router, Request, Response } from "express";
import profileController from "../controllers/profileController";

const router = Router();

router.get("/students",
  profileController.getStudents,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);

  })

router.get("/instructors",
  profileController.getInstructors,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);

  })

router.post("/new",
  profileController.addProfile,
  (_req: Request, res: Response) => {

    res.status(200).json("Success!")

  })

router.post("/instructor/new",
  profileController.addInstructor,
  (_req: Request, res: Response) => {

    res.status(200).json("Success!");

  })

router.patch("/student/:id/link",
  profileController.linkInstructor,
  (_req: Request, res: Response) => {

    res.status(200).json("Success!");

  }
)

router.delete("/:id", profileController.deleteProfile,
  (_req: Request, res: Response) => {

    res.status(200).json("Success!");

  })

router.delete("/instructor/:id",
  profileController.deleteInstructor,
  (_req: Request, res: Response) => {

    res.status(200).json("Success!");

  }
)



export default router;