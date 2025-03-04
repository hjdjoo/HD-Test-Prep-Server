import { createClient } from "@supabase/supabase-js";
import { Response, Request } from "express";
// import { parse } from "cookie";
import { Database } from "@/database.types";

const SUPABASE_PUBLIC_KEY = process.env.VITE_SUPABASE_PUBLIC_KEY!;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;

interface Context {
  req: Request;
  res: Response;
}

const createSupabase = (context: Context) => {
  // console.log("CreateSupabase/cookies: ", context.req.cookies);

  const { accessToken, refreshToken } = context.req.cookies;

  const client = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
    auth: {
      persistSession: true,
    },
  });

  // Set the session if the accessToken is found.
  if (accessToken && refreshToken) {
    console.log("tokens found, setting supabase server client session");
    client.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    }).then(res => {
      const { error } = res;
      console.error("sessionError: ", error);
      if (error) {
        console.error("message: ", error?.message);
      }
    });

  }
  return client;
};

export default createSupabase;
