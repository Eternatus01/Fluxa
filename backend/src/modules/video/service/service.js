import supabase from "./../../../lib/supabase/client.js";
import TagService from "./TagService.js";

export default class VideoService {
  static async uploadVideo(
    user_id,
    title,
    description,
    videoUrl,
    thumbnailUrl,
    tags = [],
    videoType
  ) {
    try {
      const { data, error } = await supabase
        .from("videos")
        .insert([
          {
            user_id,
            title,
            description,
            video_url: videoUrl,
            thumbnail_url: thumbnailUrl,
            tags,
            type: videoType,
          },
        ])
        .select();

      if (error) {
        console.error("Ошибка при загрузке видео:", error);
        throw error;
      }

      if (tags.length > 0) {
        await TagService.addTagsToVideo(data[0].id, tags);
      }

      return data;
    } catch (error) {
      console.error("Ошибка при загрузке видео:", error);
      throw error;
    }
  }

  static async getAllVideos() {
    try {
      const { data, error } = await supabase
        .from("videos")
        .select(
          `
          id, 
          title, 
          created_at, 
          views, 
          likes_count, 
          dislikes_count, 
          user:user_id (
            channel_name, 
            avatar_url
          ), 
          thumbnail_url, 
          user_id
        `
        )
        .eq("type", "public")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Ошибка при получении всех видео:", error);
        throw error;
      }

      return [
        ...(data || []).map((video) => ({
          id: video.id,
          title: video.title,
          created_at: video.created_at,
          views: video.views,
          likes_count: video.likes_count,
          dislikes_count: video.dislikes_count,
          thumbnail_url: video.thumbnail_url,
          user_id: video.user_id,
          channel_name: video.user?.channel_name,
          avatar_url: video.user?.avatar_url,
        })),
      ];
    } catch (error) {
      console.error("Ошибка при получении всех видео:", error);
      throw error;
    }
  }

  static async getUserVideos(id) {
    try {
      const { data, error } = await supabase
        .from("videos")
        .select(
          `
          id, 
          title, 
          created_at, 
          views, 
          likes_count, 
          dislikes_count, 
          user:user_id (
            channel_name, 
            avatar_url
          ), 
          thumbnail_url, 
          user_id
          `
        )
        .eq("user_id", id);

      if (error) {
        console.error(
          `Ошибка при получении видео пользователя с ID ${id}:`,
          error
        );
        throw error;
      }
      return [
        ...(data || []).map((video) => ({
          id: video.id,
          title: video.title,
          created_at: video.created_at,
          views: video.views,
          likes_count: video.likes_count,
          dislikes_count: video.dislikes_count,
          thumbnail_url: video.thumbnail_url,
          user_id: video.user_id,
          channel_name: video.user?.channel_name,
          avatar_url: video.user?.avatar_url,
        })),
      ];
    } catch (error) {
      console.error(
        `Ошибка при получении видео пользователя с ID ${id}:`,
        error
      );
      throw error;
    }
  }

  static async getVideo(video_id, user_id) {
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("id", video_id)
        .single();

      if (error) {
        console.error(`Ошибка при получении видео с ID ${video_id}:`, error);
        throw error;
      }
      if (data.type === "private" && data.user_id !== user_id) {
        throw new Error("У вас нет доступа к этому видео.");
      }

      return data;
    } catch (error) {
      console.error(`Ошибка при получении видео с ID ${video_id}:`, error);
      throw error;
    }
  }

  static async updateVideo(
    video_id,
    user_id,
    title,
    description,
    thumbnailUrl,
    video_url,
    tags = [],
    type
  ) {
    try {
      const { error } = await supabase
        .from("videos")
        .update({
          title,
          user_id,
          description,
          thumbnail_url: thumbnailUrl,
          video_url,
          tags,
          type,
        })
        .eq("id", video_id);

      if (tags.length > 0) {
        await TagService.addTagsToVideo(video_id, tags);
      }
      if (error) throw error;
    } catch (error) {
      console.error(`Ошибка при обновлении видео с ID ${video_id}:`, error);
      throw error;
    }
  }

  static async searchVideos(query) {
    try {
      const videoSelect = `
        id, 
        title, 
        created_at, 
        views, 
        likes_count, 
        dislikes_count, 
        user:user_id (
          channel_name, 
          avatar_url
        ), 
        thumbnail_url, 
        user_id
      `;

      const formatVideo = (video) => ({
        id: video.id,
        title: video.title,
        created_at: video.created_at,
        views: video.views,
        likes_count: video.likes_count,
        dislikes_count: video.dislikes_count,
        thumbnail_url: video.thumbnail_url,
        user_id: video.user_id,
        channel_name: video.user?.channel_name,
        avatar_url: video.user?.avatar_url,
      });

      // Поиск по названию видео
      const { data: titleResults, error } = await supabase
        .from("videos")
        .select(videoSelect)
        .eq("type", "public")
        .filter("title", "ilike", `%${query}%`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Поиск видео по имени канала
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id")
        .filter("channel_name", "ilike", `%${query}%`);

      if (usersError) throw usersError;

      let channelResults = [];
      if (users?.length > 0) {
        const { data: videosByUsers, error: channelError } = await supabase
          .from("videos")
          .select(videoSelect)
          .eq("type", "public")
          .in(
            "user_id",
            users.map((user) => user.id)
          )
          .order("created_at", { ascending: false });

        if (channelError) throw channelError;
        channelResults = videosByUsers || [];
      }

      // Объединяем и форматируем результаты
      const allResults = [
        ...(titleResults || []).map(formatVideo),
        ...(channelResults || []).map(formatVideo),
      ];

      // Удаляем дубликаты по id
      return Array.from(
        new Map(allResults.map((video) => [video.id, video])).values()
      );
    } catch (error) {
      console.error("Ошибка при поиске видео:", error);
      throw error;
    }
  }
}
