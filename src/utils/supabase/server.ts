import { createClient } from "@supabase/supabase-js";
import { Response, Request } from "express";
// import { parse } from "cookie";
import { Database } from "@/database.types.js";

const SUPABASE_PUBLIC_KEY = process.env.SUPABASE_PUBLIC_KEY!;
const SUPABASE_URL = process.env.SUPABASE_URL!;

interface Context {
  req: Request;
  res: Response;
}

const createSupabase = (context: Context) => {
  // console.log("CreateSupabase/cookies: ", context.req.cookies);
  const authHeader = context.req.headers['authorization'];
  const accessToken = authHeader?.split(' ')[1]; // Bearer <token>  

  if (!accessToken) {
    console.log("No access token found.");
  }

  const client = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });

  return client;
};

export default createSupabase;
