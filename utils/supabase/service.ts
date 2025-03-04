// import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
// import createSupabase from "./client";
import { createClient } from "@supabase/supabase-js";
// import { Response, Request } from "express";
import { Database } from "@/database.types";


const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!

// interface Context {
//   req: Request,
//   res: Response
// }

const createServiceClient = () => {
  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY)
};

export default createServiceClient;