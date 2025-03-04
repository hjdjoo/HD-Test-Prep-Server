import { Router } from "express";
import questionRouter from "./questions";
import categoriesRouter from "./categories";
import problemTypesRouter from "./problemTypes";
import tagsRouter from "./tags";
import feedbackRouter from "./feedback";
import studentResponsesRouter from "./studentResponses";
import practiceSessionRouter from "./practiceSession";
import profilesRouter from "./profiles"
// import categoriesR
// import userController from "../controllers/userController";
const dbRouter = Router();

dbRouter.use("/questions",
  questionRouter);

dbRouter.use("/categories",
  categoriesRouter);

dbRouter.use("/problem_types",
  problemTypesRouter);

dbRouter.use("/tags",
  tagsRouter);

dbRouter.use("/feedback",
  feedbackRouter);

dbRouter.use("/student_responses",
  studentResponsesRouter);

dbRouter.use("/practice_session",
  practiceSessionRouter);

dbRouter.use("/profiles",
  profilesRouter);

export default dbRouter;