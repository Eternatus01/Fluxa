import { apiClient } from "./../../../widgets/apiClient";
import { useApiWithCache } from "../../../shared/composables/useApiWithCache";
import type {
    Playlist,
    CreatePlaylistRequest,
    AddVideoToPlaylistRequest,
    RemoveVideoFromPlaylistRequest,
    UpdatePlaylistRequest,
} from '../types';

interface ErrorMessage {
    message?: string;
}

export const usePlaylist = () => {
    // Создаем экземпляр API с кэшированием для плейлистов
    const api = useApiWithCache('playlist', {
        baseUrl: 'http://localhost:3001',
        defaultCacheOptions: {
            enabled: true,
            ttl: 15 * 60 * 1000, // 15 минут по умолчанию
            persistent: true
        }
    });

    const fetchPlaylist = async (playlistId: string, userId?: string): Promise<Playlist> => {
        try {
            const { data } = await api.get<{ data: Playlist }>(`/api/playlist/${playlistId}`, {
                user_id: userId
            }, {
                key: `playlist:${playlistId}`,
                ttl: 5 * 60 * 1000,
                forceRefresh: true
            });

            return data.value;
        } catch (error) {
            const err = error as ErrorMessage;
            throw new Error(err?.message || 'Не удалось загрузить плейлист');
        }
    };

    const fetchUserPlaylists = async (userId: string): Promise<Playlist[]> => {
        if (!userId) {
            throw new Error('ID пользователя не указан');
        }

        try {
            const { data } = await api.get<{ data: Playlist[] }>(`/api/playlist/user/${userId}`, {}, {
                key: `playlists:user:${userId}`,
                ttl: 10 * 60 * 1000,
                forceRefresh: true
            });

            return data.value;
        } catch (error) {
            const err = error as ErrorMessage;
            throw new Error(err?.message || 'Не удалось загрузить плейлисты пользователя');
        }
    };

    const fetchPublicPlaylists = async (): Promise<Playlist[]> => {
        try {
            const { data } = await api.get<{ data: Playlist[] }>('/api/playlist/public', {}, {
                key: 'playlists:public',
                ttl: 5 * 60 * 1000 // 5 минут для публичных плейлистов
            });

            return data.value;
        } catch (error) {
            const err = error as ErrorMessage;
            throw new Error(err?.message || 'Не удалось загрузить публичные плейлисты');
        }
    };

    const createPlaylist = async (playlistData: CreatePlaylistRequest): Promise<Playlist> => {
        try {
            const response = await apiClient<Playlist>('/api/playlist/create', {
                method: 'POST',
                data: playlistData
            });

            // Обязательная инвалидация кэшей для принудительного обновления данных
            api.invalidateCache(`/api/playlist/user/${playlistData.user_id}`);
            api.invalidateCache(`playlists:user:${playlistData.user_id}`);

            if (playlistData.is_public) {
                api.invalidateCache('/api/playlist/public');
                api.invalidateCache('playlists:public');
            }

            // Прямое обновление кэша для плейлистов пользователя - для надежности
            clearPlaylistCache();

            return response;
        } catch (error) {
            const err = error as ErrorMessage;
            throw new Error(err?.message || 'Не удалось создать плейлист');
        }
    };

    const deletePlaylist = async (playlistId: string, userId: string): Promise<{ success: boolean }> => {
        try {
            const { data } = await apiClient<{ success: boolean }>('/api/playlist/delete', {
                method: 'DELETE',
                data: { playlist_id: playlistId, user_id: userId }
            });

            // Инвалидируем кэш для плейлистов пользователя и публичных плейлистов
            invalidateUserPlaylistsCache(userId);
            api.invalidateCache('playlists:public');

            return data;
        } catch (error) {
            const err = error as ErrorMessage;
            throw new Error(err?.message || 'Не удалось удалить плейлист');
        }
    };

    const addVideoToPlaylist = async (request: AddVideoToPlaylistRequest): Promise<any> => {
        try {
            const { data } = await apiClient('/api/playlist/add-video', {
                method: 'POST',
                data: request
            });

            // Инвалидируем кэш для обновленного плейлиста
            invalidatePlaylistCache(request.playlist_id, request.user_id);

            return data;
        } catch (error) {
            const err = error as ErrorMessage;
            throw new Error(err?.message || 'Не удалось добавить видео в плейлист');
        }
    };

    const removeVideoFromPlaylist = async (request: RemoveVideoFromPlaylistRequest): Promise<{ success: boolean }> => {
        try {
            const data = await apiClient<{ success: boolean }>('/api/playlist/remove-video', {
                method: 'POST',
                data: request
            });

            // Инвалидируем кэш для обновленного плейлиста
            invalidatePlaylistCache(request.playlist_id, request.user_id);

            return data;
        } catch (error) {
            const err = error as ErrorMessage;
            throw new Error(err?.message || 'Не удалось удалить видео из плейлиста');
        }
    };

    // Вспомогательная функция для инвалидации кэша плейлиста
    const invalidatePlaylistCache = (playlistId: string, userId?: string) => {
        api.invalidateCache(`playlist:${playlistId}`);
        api.invalidateCache('playlists:public');
        if (userId) {
            invalidateUserPlaylistsCache(userId);
        }
    };

    // Вспомогательная функция для инвалидации кэша плейлистов пользователя
    const invalidateUserPlaylistsCache = (userId: string) => {
        api.invalidateCache(`playlists:user:${userId}`);
    };

    // Очистка всего кэша для плейлистов
    const clearPlaylistCache = () => {
        api.invalidateCache('playlist:');
        api.invalidateCache('playlists:');
    };

    const uploadPlaylistCover = async (file: File, coverPath: string): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('coverPath', coverPath);

        await apiClient('/api/storage/playlist-cover', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: formData,
        });

        return `https://zldqqthnfodtqdcfezap.supabase.co/storage/v1/object/public/playlists/${coverPath}`;
    };

    const updatePlaylist = async (data: UpdatePlaylistRequest): Promise<Playlist> => {
        try {
            const response = await apiClient<Playlist>('/api/playlist/update', {
                method: 'PATCH',
                data
            });
            invalidatePlaylistCache(data.playlist_id, data.user_id);
            return response;
        } catch (error) {
            const err = error as ErrorMessage;
            throw new Error(err?.message || 'Не удалось обновить плейлист');
        }
    };

    // Подписка на плейлист
    const subscribeToPlaylist = async (user_id: string, playlist_id: string) => {
        try {
            const { data } = await apiClient<{ data: any }>('/api/playlist/subscribe', {
                method: 'POST',
                data: { user_id, playlist_id }
            });
            return data;
        } catch (error) {
            throw new Error('Не удалось подписаться на плейлист');
        }
    };

    // Отписка от плейлиста
    const unsubscribeFromPlaylist = async (user_id: string, playlist_id: string) => {
        try {
            const { data } = await apiClient<{ data: any }>('/api/playlist/unsubscribe', {
                method: 'POST',
                data: { user_id, playlist_id }
            });
            return data;
        } catch (error) {
            throw new Error('Не удалось отписаться от плейлиста');
        }
    };

    // Получить плейлисты, на которые подписан пользователь
    const fetchSubscribedPlaylists = async (user_id: string) => {
        try {
            const { data } = await api.get<{ data: Playlist[] }>(`/api/playlist/subscribed/${user_id}`);
            return data.value;
        } catch (error) {
            throw new Error('Не удалось получить подписанные плейлисты');
        }
    };

    // Получить все плейлисты пользователя: собственные и по подписке
    const fetchAllUserPlaylists = async (user_id: string) => {
        try {
            const { data } = await api.get<{ data: Playlist[] }>(`/api/playlist/all/${user_id}`, {}, {
                key: `playlists:all:${user_id}`,
                ttl: 5 * 60 * 1000, // 5 минут
                forceRefresh: true
            });
            return data.value;
        } catch (error) {
            throw new Error('Не удалось получить все плейлисты пользователя');
        }
    };

    // Проверить, подписан ли пользователь на плейлист
    const isSubscribedToPlaylist = async (user_id: string, playlist_id: string) => {
        try {
            const { data } = await api.get<{ isSubscribed: boolean }>(`/api/playlist/isSubscribed/${user_id}/${playlist_id}`, {}, {
                key: `playlist:isSubscribed:${user_id}:${playlist_id}`,
                ttl: 60 * 1000, // Кэш на 1 минуту
                forceRefresh: false
            });
            return data.value.isSubscribed;
        } catch (error) {
            throw new Error('Не удалось проверить подписку на плейлист');
        }
    };

    // Получить все публичные плейлисты всех пользователей
    const fetchAllPublicPlaylists = async (): Promise<Playlist[]> => {
        try {
            const { data } = await api.get<{ data: Playlist[] }>('/api/playlist/public', {}, {
                key: 'playlists:public',
                ttl: 5 * 60 * 1000,
                forceRefresh: true
            });
            return data.value;
        } catch (error) {
            throw new Error('Не удалось загрузить публичные плейлисты');
        }
    };

    return {
        fetchPlaylist,
        fetchUserPlaylists,
        fetchPublicPlaylists,
        createPlaylist,
        deletePlaylist,
        addVideoToPlaylist,
        removeVideoFromPlaylist,
        invalidatePlaylistCache,
        clearPlaylistCache,
        uploadPlaylistCover,
        updatePlaylist,
        subscribeToPlaylist,
        unsubscribeFromPlaylist,
        fetchSubscribedPlaylists,
        fetchAllPublicPlaylists,
        isSubscribedToPlaylist,
        fetchAllUserPlaylists
    };
}; 