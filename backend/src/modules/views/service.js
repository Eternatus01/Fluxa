import supabase from "../../lib/supabase/client.js";

export default class ViewService {
  static async addView(video_id, user_id, clientId) {
    try {
      await supabase.rpc("increment_views", {
        video_id: video_id,
        user_id: user_id || null,
        client_id: clientId,
      });
      const { data } = await supabase
        .from("videos")
        .select("views")
        .eq("id", video_id)
        .single();
    } catch (error) {
      console.error(`Ошибка при добавления просмотра на видео`, error);
      throw error;
    }
  }
}
