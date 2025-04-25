import "dotenv/config"
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

import userRouter from "./routes/user.js";
import dbRouter from "./routes/db.js";
import mailRouter from "./routes/mail.js";
import userController from "./controllers/userController.js";

import { ServerError } from "./_types/server-types.js";


const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET!

process.on('uncaughtException', function (err) {
  console.log(err);
});

const corsOptions = {
  origin: process.env.VITE_URL!,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
}

const PORT = Number(process.env.SERVER_PORT) || 3000;

const app: Application = express();
console.log("entered express server");

app.use((req, res, next) => {
  const start = Date.now(); // mark request start time

  res.on("finish", () => { // when the response finishes
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });

  next();
});

app.set("trust proxy", 1);

app.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(SUPABASE_JWT_SECRET))

app.use("/health", (_req: Request, res: Response) => {
  res.status(200).json("ok");
});

app.use("/auth", userRouter);
app.use("/db", userController.checkTokens, dbRouter);
app.use("/mail", userController.checkTokens, mailRouter);

app.use("/*", (_req: Request, res: Response) => {

  res.status(404).json("Page was not found")

})

function errorHandler(err: ServerError, _req: Request, res: Response, _next: NextFunction) {

  if (err) {

    console.error(err);

    const defaultError: ServerError = {
      log: "Global handler caught unknown middleware error",
      status: 500,
      message: {
        error: "Unknown middleware error"
      }
    }

    const errObj = Object.assign({}, defaultError, err);

    res.status(errObj.status).json(errObj.message);

  }
}

app.use(errorHandler)

app.listen(PORT, "0.0.0.0", () => {

  console.log(`Server listening on port ${PORT}`);

});