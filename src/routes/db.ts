import { Router } from "express";
import questionRouter from "./questions.js";
import categoriesRouter from "./categories.js";
import problemTypesRouter from "./problemTypes.js";
import tagsRouter from "./tags.js";
import feedbackRouter from "./feedback.js";
import studentResponsesRouter from "./studentResponses.js";
import practiceSessionRouter from "./practiceSession.js";
import profilesRouter from "./profiles.js"
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