import { apiClient } from "./../../../widgets/apiClient";
import { useApiWithCache } from "../../../shared/composables/useApiWithCache";
import type { Video } from "../types/videoTypes";

interface ErrorMessage {
    message?: string;
}

interface ApiResponse<T> {
    data: T;
    message?: string;
}

export const useVideoApi = () => {
    // Создаем экземпляр API с кэшированием для видео
    const api = useApiWithCache('video', {
        baseUrl: 'http://localhost:3001',
        defaultCacheOptions: {
            enabled: true,
            ttl: 15 * 60 * 1000, // 15 минут по умолчанию
            persistent: true
        }
    });

    const fetchVideos = async (): Promise<Video[]> => {
        try {
            const { data } = await api.get<ApiResponse<Video[]>>('/api/video/all', {}, {
                key: 'videos:all',
                ttl: 5 * 60 * 1000 // 5 минут для списка всех видео
            });
            return data.value;
        } catch (error) {
            const err = error as ErrorMessage;
            throw new Error(err?.message || 'Не удалось загрузить видео');
        }
    };

    const fetchUserVideos = async (user_id: string | undefined): Promise<Video[]> => {
        if (!user_id) {
            throw new Error('ID пользователя не указан');
        }

        try {
            // Исправляем передачу параметров - передаем user_id напрямую, а не в объекте params
            const { data } = await api.get<ApiResponse<Video[]>>(`/api/video/userVideos?user_id=${user_id}`, {}, {
                key: `videos:user:${user_id}`,
                ttl: 10 * 60 * 1000 // 10 минут для видео пользователя
            });
            return data.value;
        } catch (error) {
            const err = error as ErrorMessage;
            throw new Error(err?.message || 'Не удалось загрузить видео пользователя');
        }
    };

    const fetchVideo = async (id: string, user_id: string, forceRefresh = false): Promise<Video> => {
        try {
            const { data } = await api.get<ApiResponse<Video>>(`/api/video/fetch?id=${id}&user_id=${user_id}`, {}, {
                key: `video:${id}`,
                ttl: 5 * 60 * 1000,
                forceRefresh
            });
            return data.value;
        } catch (error) {
            const err = error as ErrorMessage;
            throw new Error(err?.message || 'Не удалось загрузить видео');
        }
    };

    const addView = async (video_id: string, user_id: string): Promise<void> => {
        try {
            await apiClient('/api/views/add', {
                method: 'POST',
                data: { video_id, user_id }
            });

            await apiClient('/api/history', {
                method: 'POST',
                data: { video_id }
            });

            // Инвалидируем кэш для этого видео
            invalidateVideoCache(video_id, user_id);
        } catch (error) {
            const err = error as ErrorMessage;
            throw new Error(err?.message || 'Не удалось добавить просмотр');
        }
    };

    const updateVideo = async (
        video_id: string,
        user_id: string,
        title: string,
        description: string,
        thumbnail_file: File | undefined,
        video_url: string | undefined,
        thumbnailOldPath: string | undefined,
        tags: string[],
        type: string
    ): Promise<void> => {
        try {
            let thumbnailUrl: string | undefined = thumbnail_file
                ? `https://zldqqthnfodtqdcfezap.supabase.co/storage/v1/object/public/Thumbnails/${user_id}/${thumbnail_file?.name}`
                : thumbnailOldPath;

            if (thumbnail_file) {
                const storageFormData = new FormData();
                storageFormData.append('thumbnail', thumbnail_file);
                storageFormData.append('thumbnailPath', `${user_id}/${thumbnail_file?.name}`);

                const { error: storageError } = await apiClient(
                    '/api/storage/thumbnail',
                    {
                        method: 'POST',
                        data: storageFormData
                    }
                );

                if (storageError) throw storageError;
            }

            // Сначала инвалидируем кэш, чтобы гарантировать свежесть данных
            invalidateVideoCache(video_id, user_id);

            // Затем выполняем запрос на обновление видео
            await apiClient(
                '/api/video/update',
                {
                    method: 'PATCH',
                    data: {
                        video_id,
                        user_id,
                        title,
                        description,
                        thumbnailUrl,
                        video_url,
                        tags,
                        type
                    }
                }
            );

            // Еще раз инвалидируем кэш для гарантии того, что данные будут получены свежие
            invalidateVideoCache(video_id, user_id);

            // Инвалидируем также кэш для поиска
            api.invalidateCache('videos:search:');
        } catch (error) {
            const err = error as ErrorMessage;
            throw new Error(err?.message || 'Не удалось обновить видео');
        }
    };

    // Вспомогательная функция для инвалидации кэша видео
    const invalidateVideoCache = (videoId: string, userId?: string) => {
        api.invalidateCache(`video:${videoId}`);
        api.invalidateCache('videos:all');
        if (userId) {
            api.invalidateCache(`videos:user:${userId}`);
        }
    };

    // Очистка всего кэша для видео
    const clearVideoCache = () => {
        api.invalidateCache('videos:all');
        api.invalidateCache('videos:search:');
    };

    const searchVideos = async (query: string): Promise<Video[]> => {
        try {
            const { data } = await api.get<ApiResponse<Video[]>>('/api/video/search', { query }, {
                key: `videos:search:${query}`,
                ttl: 5 * 60 * 1000 // 5 минут для результатов поиска
            });
            return data.value;
        } catch (error) {
            const err = error as ErrorMessage;
            throw new Error(err?.message || 'Не удалось выполнить поиск видео');
        }
    };

    return {
        fetchVideos,
        fetchUserVideos,
        fetchVideo,
        addView,
        updateVideo,
        invalidateVideoCache,
        clearVideoCache,
        searchVideos,
    };
};