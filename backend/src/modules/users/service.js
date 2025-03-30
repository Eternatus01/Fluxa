import supabase from "../../lib/supabase/client.js";

export default class UserService {
  static async getUser(id) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select(
          "id, username, avatar_url, channel_name, bunner_url, subscribers_count"
        )
        .eq("id", id)
        .maybeSingle();

      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getUsers(ids) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select(
          "id, username, avatar_url, channel_name, bunner_url, subscribers_count"
        )
        .in("id", ids)

      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getUserByUsername(username) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .maybeSingle();

      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
}
