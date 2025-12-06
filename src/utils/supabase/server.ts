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

  const client = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
    auth: {
      persistSession: true,
    },
  });

  const { req } = context

  const authHeader = req.headers.authorization
  const { cookies } = req

  console.log(cookies.refresh_token)

  if (authHeader && authHeader.startsWith("Bearer ") && cookies.refresh_token) {

    client.auth.setSession({
      access_token: authHeader.replace("Bearer ", ""),
      refresh_token: cookies.refresh_token
    }).then(res => {
      const { error } = res;
      if (error) {
        console.error("message: ", error.message)
      }
    })
  }

  return client;
};

export default createSupabase;
