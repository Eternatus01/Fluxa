import supabase from "../../lib/supabase/client.js";

export default class HistoryService {
  static async addToHistory(userId, video_id) {
    try {
      // Проверяем, существует ли уже запись для этого пользователя и видео
      const { data: existingRecord, error: checkError } = await supabase
        .from("history")
        .select("id")
        .eq("user_id", userId)
        .eq("video_id", video_id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingRecord) {
        // Если запись существует, обновляем время просмотра
        const { error: updateError } = await supabase
          .from("history")
          .update({ watched_at: new Date().toISOString() })
          .eq("id", existingRecord.id);

        if (updateError) throw updateError;
      } else {
        // Если записи нет, создаем новую
        const { error } = await supabase
          .from("history")
          .insert([{ user_id: userId, video_id }]);

        if (error) throw error;
      }
    } catch (error) {
      console.error("Ошибка при добавлении в историю:", error);
      throw error;
    }
  }

  static async getHistory(user_id) {
    try {
      const { data, error } = await supabase
        .from("history")
        .select(
          `
        *,
        video:video_id (
          id,
          title,
          thumbnail_url,
          created_at,
          views,
          user:user_id (
            channel_name,
            avatar_url
          )
        )
      `
        )
        .eq("user_id", user_id)
        .order("watched_at", { ascending: false });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Ошибка при получении истории:", error);
      throw error;
    }
  }

  static async clearHistory(user_id) {
    try {
      const { error } = await supabase
        .from("history")
        .delete()
        .eq("user_id", user_id);

      if (error) throw error;
      return { success: true, message: "История просмотров очищена" };
    } catch (error) {
      console.error("Ошибка при очистке истории:", error);
      throw error;
    }
  }
}
