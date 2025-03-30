import supabase from "../../lib/supabase/client.js";
import { CustomError } from "../../middlewares/CustomError.js";

export default class AuthService {
  static async signUp(email, password, username, channel_name) {
    try {
      const { data: userExists } = await supabase
        .from("users")
        .select("id, email, username, channel_name")
        .or(
          `email.eq.${email}, username.eq.${username}, channel_name.eq.${channel_name}`
        )
        .maybeSingle();

      if (userExists) {
        throw new CustomError(
          "Пользователь с такой почтой или именем уже существует",
          400
        );
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      const { user } = data;
      const { error: userError } = await supabase.from("users").insert([
        {
          id: user.id,
          email: email,
          username: username,
          channel_name: channel_name,
        },
      ]);

      if (userError) {
        throw userError;
      }

      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      const token = data.session.access_token;

      const refreshToken = data.session.refresh_token;
      const userCurrent = {
        user: userData,
        token: token,
        refreshToken: refreshToken,
      };

      return userCurrent;
    } catch (error) {
      throw error;
    }
  }

  static async signIn(email, password) {
    try {
      const { data: userExists, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (userError || !userExists) {
        throw new CustomError("Пользователь с такой почтой не существует", 400);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new CustomError("Неверные учетные данные.", 400);
      }

      const token = data.session.access_token;
      const refreshToken = data.session.refresh_token;
      const userCurrent = {
        user: userExists,
        token: token,
        refreshToken: refreshToken,
      };

      return userCurrent;
    } catch (error) {
      throw error;
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  static async refreshToken(refreshToken) {
    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error) {
        throw new CustomError("Не удалось обновить токен", 401);
      }

      if (!data.session) {
        throw new CustomError("Сессия не найдена", 401);
      }

      // Получаем данные пользователя
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (userError) {
        throw new CustomError("Пользователь не найден", 404);
      }

      return {
        user: userData,
        token: data.session.access_token,
        refreshToken: data.session.refresh_token,
      };
    } catch (error) {
      throw error;
    }
  }
}
