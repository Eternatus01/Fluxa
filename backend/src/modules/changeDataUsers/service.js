import supabase from "../../lib/supabase/client.js";

export default class ChangeService {
  static async changeAvatar(id, avatar_url) {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ avatar_url })
        .eq("id", id)
        .select("avatar_url")
        .single();
      if (error) {
        throw new Error("Ошибка при обновлении URL аватара: " + error.message);
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async changeBunner(id, bunner_url) {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ bunner_url })
        .eq("id", id)
        .select("bunner_url")
        .single();
      if (error) {
        throw new Error("Ошибка при обновлении URL баннера: " + error.message);
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async changeChannelName(id, channel_name) {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ channel_name })
        .eq("id", id)
        .select("channel_name")
        .single();
      if (error) {
        throw new Error(
          "Ошибка при обновлении названия канала: " + error.message
        );
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async changeUsername(id, username) {
    try {
      // Проверяем, не занято ли имя пользователя
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("username", username)
        .neq("id", id) // Исключаем текущего пользователя
        .maybeSingle();

      if (existingUser) {
        throw new Error("Имя пользователя уже занято");
      }

      const { data, error } = await supabase
        .from("users")
        .update({ username })
        .eq("id", id)
        .select("username")
        .single();

      if (error) {
        throw new Error(
          "Ошибка при обновлении имени пользователя: " + error.message
        );
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}
