import { Tables } from "@/database.types.js";

export interface ServerError {
  log: string
  status: number
  message: {
    error: string
  }
}

export interface ClientData {
  [field: string]: any
}

export type DbStudentData = Tables<"profiles">

export type DbInstructorData = Tables<"tutors">

export type DbStudentResponse = Tables<"student_responses">

export type DbFeedbackFormData = Tables<"question_feedback">

export type DbTagsData = Tables<"tags">
