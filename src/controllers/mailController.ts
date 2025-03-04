import { Request, Response, NextFunction } from "express"
import * as nodemailer from "nodemailer";
import * as fs from "fs";
import path from "path";
import createSupabase from "@/utils/supabase/server";
import { decode } from "base64-arraybuffer";
import { ServerError } from "../_types/server-types";

// const MG_DOMAIN = process.env.MG_DOMAIN!;
// const MG_SENDING_API_KEY = process.env.MG_SENDING_API_KEY!;
const MG_SMTP_USER = process.env.MG_SMTP_USER!;
const MG_SMTP_PASSWORD = process.env.MG_SMTP_PASSWORD!;

const transport = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 465,
  auth: {
    user: MG_SMTP_USER,
    pass: MG_SMTP_PASSWORD
  },
  logger: true,
})


interface MailController {
  [middleware: string]: (req: Request, res: Response, next: NextFunction) => void
}

const mailController: MailController = {};

mailController.extractPdf = async (req: Request, res: Response, next: NextFunction) => {
  try {

    console.log("extracting pdf...")

    const { id } = req.params;

    if (!Number(id)) {
      throw new Error("mailController/extractPdf: Couldn't parse session ID from params")
    }

    const data: Buffer[] = [];

    req.on("data", (chunk) => {
      data.push(chunk)
    })

    req.on("end", () => {

      const pdfBuffer = Buffer.concat(data);

      const base64Pdf = pdfBuffer.toString("base64");

      // save pdf to disk
      fs.writeFileSync(path.resolve("./", "server", "pdfs", `session-summary-${id}.pdf`), pdfBuffer);

      // temporarily save in mem to send to db
      const clientData = {
        sessionId: id,
        base64Pdf: base64Pdf
      }

      res.locals.clientData = Object.assign({}, res.locals.clientData, clientData)

      return next();

    })

  } catch (e) {

    const error: ServerError = {
      log: "Something went wrong while extracting pdf.",
      status: 500,
      message: {
        error: `Middleware error occurred while extracting pdf. ${e}`
      }
    }

    return next(error);

  }
}


mailController.getInstructorEmail = async (req: Request, res: Response, next: NextFunction) => {

  try {

    const { userId } = req.query;
    const supabase = createSupabase({ req, res })

    console.log(req.query)

    if (!Number(userId)) {
      throw new Error("mailController/getInstructorEmail: Couldn't parse user ID from query.");
    }

    const { data, error } = await supabase
      .from("profiles")
      .select(`
        name:name, 
        email:email,
        tutor:tutors(email)`)
      .eq("id", Number(userId))
      .single();

    if (error) {
      console.error("mailController/getInstructorEmail/supabase", error);
      throw new Error(error.message);
    }

    if (!data.tutor || !data.tutor.email) {
      throw new Error("Error while querying instructor email in DB")
    }

    const clientData = {
      studentName: data.name,
      studentEmail: data.email,
      tutorEmail: data.tutor.email
    };

    res.locals.clientData = Object.assign({}, res.locals.clientData, clientData)

    return next();

  } catch (e) {

    const error: ServerError = {
      log: "Something went wrong while getting instructor email.",
      status: 500,
      message: {
        error: `Middleware error occurred while getting instructor email. ${e}`
      }
    }

    return next(error);

  }

}

mailController.uploadPdf = async (req: Request, res: Response, next: NextFunction) => {

  try {

    console.log("uploading pdf..");

    const { id: sessionId } = req.params;

    if (!Number(sessionId)) {
      throw new Error("Couldn't parse session ID from params")
    }

    const clientData = res.locals.clientData as
      { base64Pdf: string };

    const { base64Pdf } = clientData;

    const supabase = createSupabase({ req, res })

    const { error } = await supabase
      .storage
      .from("student_reports")
      .upload(`session_summary_${sessionId}.pdf`,
        decode(base64Pdf),
        { contentType: "application/pdf" });

    if (error) {
      console.error(error.cause);
      console.error(error.message);
      throw new Error(error.message);
    }

    console.log("successfully uploaded file to db.");

    // clear PDF from memory
    delete res.locals.clientData.base64Pdf;

    return next();

  } catch (e) {

    const error: ServerError = {
      log: "Something went wrong while uploading pdf.",
      status: 500,
      message: {
        error: `Middleware error occurred while uploading pdf to db. ${e}`
      }
    }

    return next(error);

  }
}


mailController.sendEmail = async (req: Request, res: Response, next: NextFunction) => {

  try {

    console.log("in sendEmail middleware");

    const clientData = res.locals.clientData;

    const { id: sessionId } = req.params;

    console.log("sessionID: ", sessionId)

    const { studentName, studentEmail, tutorEmail }: { studentName: string, studentEmail: string, tutorEmail: string } = clientData;

    console.log("mailController.ts/clientData: ")
    console.log(studentName, studentEmail, tutorEmail);

    const fileName = `session-summary-${sessionId}.pdf`

    const pathName = path.resolve("./", "server", "pdfs", `session-summary-${sessionId}.pdf`)

    const mailOptions = {
      from: "no-reply@hdprep.me",
      to: `${tutorEmail}`,
      cc: `${studentEmail}`,
      subject: `${studentName}'s session summary`,
      text: `${studentName}'s session summary is attached.`,
      attachments: [
        {
          fileName: fileName,
          path: pathName
        }
      ]
    }

    console.log("sending email...");

    transport.sendMail(mailOptions, (err, _info) => {

      if (err) {
        console.log("Error while sending email");
        console.error("mailController/sendEmail/transport/sendMail: ");
        console.error(err);
        throw new Error(err.message);
      }

      console.log("removing file...");
      fs.unlinkSync(pathName);

    })

    res.locals.clientData = {};

    return res.status(200).json("Email successfully sent");


  } catch (e) {
    console.error(e);
    const error: ServerError = {
      log: "Something went wrong while sending email.",
      status: 500,
      message: {
        error: `Middleware error occurred while sending email. ${e}`
      }
    }

    return next(error);

  }

}

export default mailController;