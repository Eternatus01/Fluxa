import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const authenticate = async (req, res, next) => {
  let token = req.cookies.session_token;
  const refreshToken = req.cookies.refresh_token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    let userResponse = await supabase.auth.getUser(token);

    if (
      userResponse.error &&
      userResponse.error.message.includes("token is expired") &&
      refreshToken
    ) {
      const { data: refreshedSession, error: refreshError } =
        await supabase.auth.refreshSession({
          refresh_token: refreshToken,
        });

      if (refreshError) {
        return res
          .status(401)
          .json({ error: "Unauthorized: Unable to refresh token" });
      }

      token = refreshedSession.session.access_token;
      res.cookie("session_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 96 * 60 * 60 * 1000,
      });
      res.cookie("refresh_token", refreshedSession.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 96 * 60 * 60 * 1000,
      });

      userResponse = await supabase.auth.getUser(token);
    }

    if (userResponse.error) {
      console.log("Supabase auth error:", userResponse.error);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    if (!userResponse.data.user) {
      return res.status(401).json({ error: "Unauthorized: No user found" });
    }

    req.user = userResponse.data.user;
    req.token = token;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res
      .status(500)
      .json({ error: "Server error during authentication" });
  }
};
