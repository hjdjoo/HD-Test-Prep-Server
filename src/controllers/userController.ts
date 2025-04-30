import { Request, Response, NextFunction } from "express";
import createClient from "@/utils/supabase/server.js";
import createServiceClient from "@/utils/supabase/service.js";

// import HMACSH

import { type User } from "@supabase/supabase-js";
import { ServerError } from "../_types/server-types.js";
// import createSupabase from "@/utils/supabase/server";

console.log("entered userController");

interface UserController {
  [middleware: string]: (req: Request, res: Response, next: NextFunction) => void
}

const userController: UserController = {};


userController.checkTokens = async (req: Request, _res: Response, next: NextFunction) => {
  try {

    console.log("checking cookies...");
    // check if there are tokens in cookies. If not, check the body.
    const { cookies } = req;
    // console.log("cookies", cookies);
    if (cookies.accessToken) {
      console.log("access tokens detected in cookies. Continuing..")
      return next();
    }

    // return res.status(401).json({ error: "No access token detected." });
  }
  catch (e) {

    console.error(e);

    const error: ServerError = {
      log: "userController: Error while checking tokens",
      status: 401,
      message: {
        error: `${e}`
      }
    }

    return next(error);

  }

}


userController.getUser = async (req: Request, res: Response, next: NextFunction) => {

  console.log("getting user...")

  try {
    // console.log(req.cookies);
    const supabase = createClient({ req, res });
    const serviceClient = createServiceClient();

    const { data: authData, error: authError } = await supabase
      .auth
      .getUser();

    if (authError) {
      throw new Error(`Couldn't get user from DB. ${authError.message}`)
    }
    // console.log("getUser/data, error: ", authData, authError);
    if (!authData.user.email) {
      throw new Error("No email address for user detected!")
    }

    const { data: profileData, error: profileError } = await serviceClient
      .from("profiles")
      .select("*")
      .eq("email", authData.user.email)
      .single();

    if (profileError) {
      throw new Error(`Error while querying database for authorization: ${profileError.message}`)
    }

    if (!profileData.uid) {
      console.log(`No user found in profiles database. Initializing profile.`);
      // save the user information from **auth** data (from auth.users, where id=profiles.uid)
      res.locals.user = authData.user;
      // should go to initProfile
      return next();
    }

    console.log("user found!")

    return res.status(200).json(profileData);

  } catch (e) {
    console.error(e);

    const error: ServerError = {
      log: "userController: Error while getting profile data",
      status: 500,
      message: {
        error: `${e}`
      }
    }

    return next(error);

  }

}


userController.initProfile = async (_req: Request, res: Response, next: NextFunction) => {

  console.log("initializing profile...")

  try {

    const supabase = createServiceClient();
    // console.log(res.locals.user);
    const user = res.locals.user as User;

    if (!user.email) {
      throw new Error("No email detected for user while initializing profile")
    }

    const query = {
      uid: user.id,
      name: user.user_metadata.full_name,
    };

    const { data, error } = await supabase
      .from("profiles")
      .update(query)
      .eq("email", user.email)
      .select()
      .single();

    if (!data) {
      if (error) {
        throw new Error(`Couldn't initialize profile. ${error.message}`)
      } else {
        throw new Error("No response from DB")
      }
    }

    return res.status(200).json(data);

  } catch (e) {

    const error: ServerError = {
      log: "userController: Error while initializing profile",
      status: 401,
      message: {
        error: `${e}`
      }
    }

    return next(error);
  }

}


export default userController;