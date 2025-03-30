import supabase from "./../../../lib/supabase/client.js";

export default class CommentsService {
  static async addComment(videoId, userId, text, parentCommentId) {
    try {
      const { data, error } = await supabase
        .from("comments")
        .insert([
          {
            video_id: videoId,
            user_id: userId,
            text,
            parent_comment_id: parentCommentId || null,
          },
        ])
        .select("*, user:user_id (username, avatar_url)")
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Ошибка при добавлении комментария:", error);
      throw error;
    }
  }

  static async getComments(videoId) {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*, user:user_id (username, avatar_url)")
        .eq("video_id", videoId)
        .is("parent_comment_id", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Ошибка при получении комментариев:", error);
      throw error;
    }
  }

  static async deleteComment(comment_id, userId) {
    try {
      // Получаем комментарий, чтобы узнать video_id
      const { data: comment, error: commentError } = await supabase
        .from("comments")
        .select("video_id")
        .eq("id", comment_id)
        .single();
      if (commentError) throw commentError;
      // Получаем видео, чтобы проверить владельца
      const { data: video, error: videoError } = await supabase
        .from("videos")
        .select("user_id")
        .eq("id", comment.video_id)
        .single();
  
      if (videoError) throw videoError;
  
      // Проверяем, что текущий пользователь — владелец видео
      if (video.user_id !== userId) {
        throw new Error("У вас нет прав на удаление этого комментария");
      }
  
      // Удаляем комментарий
      const { error: deleteError } = await supabase
        .from("comments")
        .delete()
        .eq("id", comment_id);
  
      if (deleteError) throw deleteError;
  
      return { message: "Комментарий успешно удален" };
    } catch (error) {
      console.error("Ошибка при удалении комментария:", error);
      throw error;
    }
  }

  static async getReplies(commentId) {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*, user:user_id (username, avatar_url)")
        .eq("parent_comment_id", commentId)
        .order("created_at", { ascending: false });
  
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Ошибка при получении ответов на комментарий:", error);
      throw error;
    }
  }
}
