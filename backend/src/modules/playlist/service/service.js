import supabase from "./../../../lib/supabase/client.js";

export default class PlaylistService {
  static async createPlaylist(
    user_id,
    title,
    description = "",
    is_public = true,
    thumbnail_url = null
  ) {
    try {
      // Если обложка не указана — ставим дефолтную
      const defaultCover = "/default-playlist-cover.jpg";
      const cover = thumbnail_url || defaultCover;
      const { data, error } = await supabase
        .from("playlists")
        .insert([
          {
            user_id,
            title,
            description,
            is_public,
            thumbnail_url: cover,
          },
        ])
        .select();

      if (error) {
        console.error("Ошибка при создании плейлиста:", error);
        throw error;
      }

      return data[0];
    } catch (error) {
      console.error("Ошибка при создании плейлиста:", error);
      throw error;
    }
  }

  static async getPlaylist(playlist_id, user_id = null) {
    try {
      // Получаем информацию о плейлисте без использования соединения users
      const { data: playlist, error } = await supabase
        .from("playlists")
        .select("*")
        .eq("id", playlist_id)
        .single();

      if (error) {
        console.error(
          `Ошибка при получении плейлиста с ID ${playlist_id}:`,
          error
        );
        throw error;
      }

      // Проверяем доступ к приватному плейлисту
      if (!playlist.is_public && playlist.user_id !== user_id) {
        throw new Error("У вас нет доступа к этому плейлисту");
      }

      // Получаем информацию о владельце плейлиста
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, channel_name, avatar_url")
        .eq("id", playlist.user_id)
        .single();

      if (userError) {
        console.error(`Ошибка при получении данных пользователя:`, userError);
        // Не выбрасываем ошибку, чтобы можно было получить содержимое плейлиста
      }

      // Получаем видео из плейлиста (без столбца position)
      const { data: playlistVideos, error: videosError } = await supabase
        .from("playlist_videos")
        .select("video_id, created_at")
        .eq("playlist_id", playlist_id)
        .order("created_at"); // Сортируем по дате добавления вместо position

      if (videosError) {
        console.error(
          `Ошибка при получении видео для плейлиста ${playlist_id}:`,
          videosError
        );
        throw videosError;
      }

      // Если нет видео, возвращаем плейлист без видео
      if (!playlistVideos.length) {
        return {
          ...playlist,
          channel_name: userData?.channel_name || null,
          avatar_url: userData?.avatar_url || null,
          videos: [],
        };
      }

      // Получаем видео по их ID
      const videoIds = playlistVideos.map((item) => item.video_id);
      const { data: videos, error: videosDataError } = await supabase
        .from("videos")
        .select(
          `
          *,
          user:user_id (
            id,
            channel_name,
            avatar_url
          )
        `
        )
        .in("id", videoIds);

      if (videosDataError) {
        console.error(`Ошибка при получении данных видео:`, videosDataError);
        throw videosDataError;
      }

      // Создаем карту для сопоставления видео с их датами добавления
      const videoCreatedMap = {};
      playlistVideos.forEach((item) => {
        videoCreatedMap[item.video_id] = item.created_at;
      });

      // Форматируем видео и добавляем даты добавления
      const formattedVideos = videos.map((video) => ({
        ...video,
        added_at: videoCreatedMap[video.id] || null, // Используем дату добавления вместо позиции
        user_id: video.user.id,
        channel_name: video.user.channel_name,
        avatar_url: video.user.avatar_url,
      }));

      // Сортируем видео по дате добавления вместо позиции
      formattedVideos.sort(
        (a, b) => new Date(a.added_at) - new Date(b.added_at)
      );

      // Форматируем ответ
      return {
        ...playlist,
        channel_name: userData?.channel_name || null,
        avatar_url: userData?.avatar_url || null,
        videos: formattedVideos,
      };
    } catch (error) {
      console.error(
        `Ошибка при получении плейлиста с ID ${playlist_id}:`,
        error
      );
      throw error;
    }
  }

  static async getUserPlaylists(user_id) {
    try {
      const { data, error } = await supabase
        .from("playlists")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(
          `Ошибка при получении плейлистов пользователя ${user_id}:`,
          error
        );
        throw error;
      }

      return data;
    } catch (error) {
      console.error(
        `Ошибка при получении плейлистов пользователя ${user_id}:`,
        error
      );
      throw error;
    }
  }

  static async getPublicPlaylists() {
    try {
      // Получаем все публичные плейлисты без соединения
      const { data: playlists, error } = await supabase
        .from("playlists")
        .select(`*`)
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Ошибка при получении публичных плейлистов:", error);
        throw error;
      }

      // Если нет плейлистов, возвращаем пустой массив
      if (!playlists.length) {
        return [];
      }

      // Получаем информацию о пользователях по их ID
      const userIds = [
        ...new Set(playlists.map((playlist) => playlist.user_id)),
      ];
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select(`id, channel_name, avatar_url`)
        .in("id", userIds);

      if (usersError) {
        console.error("Ошибка при получении данных пользователей:", usersError);
        // Не выбрасываем ошибку, чтобы вернуть плейлисты без данных пользователей
      }

      // Создаем карту для быстрого доступа к информации о пользователях
      const userMap = {};
      if (users) {
        users.forEach((user) => {
          userMap[user.id] = user;
        });
      }

      // Добавляем информацию о пользователях к каждому плейлисту
      return playlists.map((playlist) => ({
        ...playlist,
        channel_name: userMap[playlist.user_id]?.channel_name || null,
        avatar_url: userMap[playlist.user_id]?.avatar_url || null,
      }));
    } catch (error) {
      console.error("Ошибка при получении публичных плейлистов:", error);
      throw error;
    }
  }

  static async addVideoToPlaylist(playlist_id, video_id, user_id) {
    try {
      // Проверяем, принадлежит ли плейлист пользователю
      const { data: playlist, error: playlistError } = await supabase
        .from("playlists")
        .select("user_id")
        .eq("id", playlist_id)
        .single();

      if (playlistError) {
        console.error(
          `Ошибка при проверке плейлиста ${playlist_id}:`,
          playlistError
        );
        throw playlistError;
      }

      if (playlist.user_id !== user_id) {
        throw new Error("Вы не можете добавлять видео в чужой плейлист");
      }

      // Проверяем, есть ли уже это видео в плейлисте
      const { data: existingVideo, error: existingError } = await supabase
        .from("playlist_videos")
        .select("id")
        .eq("playlist_id", playlist_id)
        .eq("video_id", video_id)
        .maybeSingle();

      if (existingError) {
        console.error(
          "Ошибка при проверке наличия видео в плейлисте:",
          existingError
        );
        throw existingError;
      }

      if (existingVideo) {
        throw new Error("Это видео уже добавлено в плейлист");
      }

      // Добавляем видео в плейлист без указания позиции, используя только timestamp
      const { data, error } = await supabase
        .from("playlist_videos")
        .insert([
          {
            playlist_id,
            video_id,
            // position удален, теперь используется created_at по умолчанию
          },
        ])
        .select();

      if (error) {
        console.error("Ошибка при добавлении видео в плейлист:", error);
        throw error;
      }

      // Обновляем счетчик видео в плейлисте
      await this.updatePlaylistVideoCount(playlist_id);

      // Если это первое видео в плейлисте — обновляем thumbnail_url плейлиста
      const { count, error: countError } = await supabase
        .from("playlist_videos")
        .select("id", { count: "exact" })
        .eq("playlist_id", playlist_id);
      if (!countError && count === 1) {
        // Получаем превью этого видео
        const { data: video, error: videoError } = await supabase
          .from("videos")
          .select("thumbnail_url")
          .eq("id", video_id)
          .single();
        if (video && video.thumbnail_url) {
          await supabase
            .from("playlists")
            .update({ thumbnail_url: video.thumbnail_url })
            .eq("id", playlist_id);
        }
      }

      return data[0];
    } catch (error) {
      console.error("Ошибка при добавлении видео в плейлист:", error);
      throw error;
    }
  }

  static async removeVideoFromPlaylist(playlist_id, video_id, user_id) {
    try {
      // Проверяем, принадлежит ли плейлист пользователю
      const { data: playlist, error: playlistError } = await supabase
        .from("playlists")
        .select("user_id")
        .eq("id", playlist_id)
        .single();

      if (playlistError) {
        console.error(
          `Ошибка при проверке плейлиста ${playlist_id}:`,
          playlistError
        );
        throw playlistError;
      }

      if (playlist.user_id !== user_id) {
        throw new Error("Вы не можете удалять видео из чужого плейлиста");
      }

      // Удаляем видео из плейлиста
      const { error } = await supabase
        .from("playlist_videos")
        .delete()
        .eq("playlist_id", playlist_id)
        .eq("video_id", video_id);

      if (error) {
        console.error("Ошибка при удалении видео из плейлиста:", error);
        throw error;
      }

      // Обновляем счетчик видео в плейлисте
      await this.updatePlaylistVideoCount(playlist_id);

      return { success: true };
    } catch (error) {
      console.error("Ошибка при удалении видео из плейлиста:", error);
      throw error;
    }
  }

  static async deletePlaylist(playlist_id, user_id) {
    try {
      // Проверяем, принадлежит ли плейлист пользователю
      const { data: playlist, error: playlistError } = await supabase
        .from("playlists")
        .select("user_id")
        .eq("id", playlist_id)
        .single();

      if (playlistError) {
        console.error(
          `Ошибка при проверке плейлиста ${playlist_id}:`,
          playlistError
        );
        throw playlistError;
      }

      if (playlist.user_id !== user_id) {
        throw new Error("Вы не можете удалить чужой плейлист");
      }

      // Удаляем все связи с видео
      const { error: videosError } = await supabase
        .from("playlist_videos")
        .delete()
        .eq("playlist_id", playlist_id);

      if (videosError) {
        console.error(
          `Ошибка при удалении видео из плейлиста ${playlist_id}:`,
          videosError
        );
        throw videosError;
      }

      // Удаляем сам плейлист
      const { error } = await supabase
        .from("playlists")
        .delete()
        .eq("id", playlist_id);

      if (error) {
        console.error(`Ошибка при удалении плейлиста ${playlist_id}:`, error);
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error(`Ошибка при удалении плейлиста ${playlist_id}:`, error);
      throw error;
    }
  }

  static async updatePlaylistVideoCount(playlist_id) {
    try {
      // Получаем количество видео в плейлисте
      const { count, error: countError } = await supabase
        .from("playlist_videos")
        .select("id", { count: "exact" })
        .eq("playlist_id", playlist_id);

      if (countError) {
        console.error(
          `Ошибка при подсчете видео в плейлисте ${playlist_id}:`,
          countError
        );
        throw countError;
      }

      // Обновляем счетчик в таблице плейлистов
      const { error } = await supabase
        .from("playlists")
        .update({ video_count: count })
        .eq("id", playlist_id);

      if (error) {
        console.error(
          `Ошибка при обновлении счетчика видео в плейлисте ${playlist_id}:`,
          error
        );
        throw error;
      }
    } catch (error) {
      console.error(
        `Ошибка при обновлении счетчика видео в плейлисте ${playlist_id}:`,
        error
      );
      throw error;
    }
  }

  static async updatePlaylist(
    playlist_id,
    user_id,
    title,
    description,
    is_public,
    thumbnail_url
  ) {
    try {
      // Проверяем, принадлежит ли плейлист пользователю
      const { data: playlist, error: playlistError } = await supabase
        .from("playlists")
        .select("user_id")
        .eq("id", playlist_id)
        .single();

      if (playlistError) {
        console.error(
          `Ошибка при проверке плейлиста ${playlist_id}:`,
          playlistError
        );
        throw playlistError;
      }
      if (playlist.user_id !== user_id) {
        throw new Error("Вы не можете редактировать чужой плейлист");
      }

      // Если thumbnail_url не передан или пустой, ищем превью последнего видео
      let finalThumbnail = thumbnail_url;
      if (!thumbnail_url) {
        // Получаем последнее добавленное видео
        const { data: lastVideo, error: lastVideoError } = await supabase
          .from("playlist_videos")
          .select("video_id, created_at")
          .eq("playlist_id", playlist_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (lastVideo && lastVideo.video_id) {
          // Получаем превью этого видео
          const { data: video, error: videoError } = await supabase
            .from("videos")
            .select("thumbnail_url")
            .eq("id", lastVideo.video_id)
            .single();
          if (video && video.thumbnail_url) {
            finalThumbnail = video.thumbnail_url;
          } else {
            finalThumbnail = null;
          }
        } else {
          finalThumbnail = null;
        }
      }

      // Обновляем плейлист
      const { data, error } = await supabase
        .from("playlists")
        .update({
          title,
          description,
          is_public,
          thumbnail_url: finalThumbnail,
        })
        .eq("id", playlist_id)
        .select();

      if (error) {
        console.error(`Ошибка при обновлении плейлиста ${playlist_id}:`, error);
        throw error;
      }
      return data[0];
    } catch (error) {
      console.error(`Ошибка при обновлении плейлиста ${playlist_id}:`, error);
      throw error;
    }
  }

  // Подписаться на плейлист
  static async subscribeToPlaylist(user_id, playlist_id) {
    try {
      const { data, error } = await supabase
        .from("playlist_subscriptions")
        .insert([{ user_id, playlist_id }])
        .select();
      if (error) {
        throw error;
      }
      return data[0];
    } catch (error) {
      console.error("Ошибка при подписке на плейлист:", error);
      throw error;
    }
  }

  // Отписаться от плейлиста
  static async unsubscribeFromPlaylist(user_id, playlist_id) {
    try {
      const { error } = await supabase
        .from("playlist_subscriptions")
        .delete()
        .eq("user_id", user_id)
        .eq("playlist_id", playlist_id);
      if (error) {
        throw error;
      }
      return { success: true };
    } catch (error) {
      console.error("Ошибка при отписке от плейлиста:", error);
      throw error;
    }
  }

  // Получить плейлисты, на которые подписан пользователь
  static async getSubscribedPlaylists(user_id) {
    try {
      // Получаем все id плейлистов, на которые подписан пользователь
      const { data: subs, error: subsError } = await supabase
        .from("playlist_subscriptions")
        .select("playlist_id")
        .eq("user_id", user_id);
      if (subsError) throw subsError;
      if (!subs.length) return [];
      const playlistIds = subs.map((s) => s.playlist_id);
      // Получаем сами плейлисты
      const { data: playlists, error: plError } = await supabase
        .from("playlists")
        .select("*")
        .in("id", playlistIds);
      if (plError) throw plError;
      return playlists;
    } catch (error) {
      console.error("Ошибка при получении подписанных плейлистов:", error);
      throw error;
    }
  }

  // Проверить, подписан ли пользователь на плейлист
  static async isSubscribedToPlaylist(user_id, playlist_id) {
    try {
      const { data, error } = await supabase
        .from("playlist_subscriptions")
        .select("id")
        .eq("user_id", user_id)
        .eq("playlist_id", playlist_id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return { isSubscribed: !!data };
    } catch (error) {
      console.error("Ошибка при проверке подписки на плейлист:", error);
      throw error;
    }
  }

  // Получить все плейлисты пользователя: собственные и по подписке
  static async getAllUserPlaylists(user_id) {
    try {
      // Получаем плейлисты, созданные пользователем
      const { data: ownPlaylists, error: ownError } = await supabase
        .from("playlists")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", { ascending: false });

      if (ownError) {
        console.error(
          `Ошибка при получении собственных плейлистов пользователя ${user_id}:`,
          ownError
        );
        throw ownError;
      }

      // Добавляем флаг, что это собственные плейлисты
      const ownPlaylistsWithFlag = ownPlaylists.map((playlist) => ({
        ...playlist,
        is_own: true,
      }));

      // Получаем плейлисты, на которые подписан пользователь
      // Сначала получаем ID плейлистов
      const { data: subs, error: subsError } = await supabase
        .from("playlist_subscriptions")
        .select("playlist_id")
        .eq("user_id", user_id);

      if (subsError) {
        console.error(
          `Ошибка при получении подписок пользователя ${user_id}:`,
          subsError
        );
        throw subsError;
      }

      let subscribedPlaylists = [];
      let playlistIds = [];

      // Если есть подписки, получаем их
      if (subs.length) {
        playlistIds = subs.map((s) => s.playlist_id);

        // Получаем плейлисты по ID подписок
        const { data: playlists, error: plError } = await supabase
          .from("playlists")
          .select("*")
          .in("id", playlistIds)
          .order("created_at", { ascending: false });

        if (plError) {
          console.error(
            `Ошибка при получении плейлистов по подписке пользователя ${user_id}:`,
            plError
          );
          throw plError;
        }

        subscribedPlaylists = playlists.map((playlist) => ({
          ...playlist,
          is_own: false,
          is_subscribed: true,
        }));
      }

      // Объединяем все плейлисты
      const allPlaylists = [...ownPlaylistsWithFlag, ...subscribedPlaylists];

      // Получаем информацию о пользователях для всех плейлистов
      const allCreatorIds = [
        ...new Set(allPlaylists.map((playlist) => playlist.user_id)),
      ];

      let userInfo = {};

      if (allCreatorIds.length > 0) {
        const { data: users, error: usersError } = await supabase
          .from("users")
          .select("id, username, channel_name, avatar_url")
          .in("id", allCreatorIds);

        if (usersError) {
          console.error(
            "Ошибка при получении информации о создателях плейлистов:",
            usersError
          );
        } else if (users) {
          userInfo = users.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
          }, {});
        }
      }

      // Добавляем информацию о создателях ко всем плейлистам
      const enrichedPlaylists = allPlaylists.map((playlist) => {
        const creator = userInfo[playlist.user_id] || {};
        return {
          ...playlist,
          username: creator.username || null,
          channel_name: creator.channel_name || null,
          avatar_url: creator.avatar_url || null,
        };
      });

      return enrichedPlaylists;
    } catch (error) {
      console.error(
        `Ошибка при получении всех плейлистов пользователя ${user_id}:`,
        error
      );
      throw error;
    }
  }
}
