import supabase from "../../lib/supabase/client.js";

export default class ReactionService {
  static async addReaction(video_id, user_id, type) {
    try {
      const { data } = await supabase.rpc("handle_video_reaction", {
        p_video_id: video_id,
        p_user_id: user_id,
        p_reaction: type,
      });

      return data;
    } catch (error) {
      console.error(`Ошибка при добавления реакции на видео`, error);
      throw error;
    }
  }

  static async getReactions(video_id) {
    try {
      const { data } = await supabase
        .from("videos")
        .select("likes_count, dislikes_count")
        .eq("id", video_id)
        .single();

      return data;
    } catch (error) {
      console.error(`Ошибка при загрузке реакций на видео`, error);
      throw error;
    }
  }

  static async addReactionComment(comment_id, user_id, type) {
    try {
      const { data } = await supabase.rpc("handle_comment_reaction", {
        p_comment_id: comment_id,
        p_user_id: user_id,
        p_reaction: type,
      });

      return data;
    } catch (error) {
      console.error(`Ошибка при добавления реакции на комментарий:`, error);
      throw error;
    }
  }

  static async getReactionsComment(comment_id) {
    try {
      const { data } = await supabase
        .from("comments")
        .select("likes_count, dislikes_count")
        .eq("id", comment_id)
        .single();

      return data;
    } catch (error) {
      console.error(`Ошибка при загрузке реакций на комментарях`, error);
      throw error;
    }
  }
}
