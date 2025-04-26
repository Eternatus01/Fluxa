import { usePlaylist } from "../composable/usePlaylist";
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Playlist, RemoveVideoFromPlaylistRequest, CreatePlaylistRequest, AddVideoToPlaylistRequest, UpdatePlaylistRequest } from '@/features/playlist/types/playlistTypes';
import { useUiStore } from '@/shared/stores/uiStore';

export const usePlaylistStore = defineStore("playlist", () => {
    const playlistApi = usePlaylist();
    const uiStore = useUiStore();

    const playlists = ref<Playlist[]>([]);
    const error = ref<Error | null>(null);
    const subscribedPlaylists = ref<Playlist[]>([]);
    const allPublicPlaylists = ref<Playlist[]>([]);
    const allUserPlaylists = ref<Playlist[]>([]);

    const fetchUserPlaylists = async (userId: string) => {
        uiStore.isLoading = true;
        error.value = null;

        try {
            playlists.value = await playlistApi.fetchUserPlaylists(userId);
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Не удалось загрузить плейлисты');
            console.error('Ошибка при загрузке плейлистов:', err);
        } finally {
            uiStore.isLoading = false;
        }
    };

    const fetchPlaylist = async (playlistId: string, userId?: string): Promise<Playlist> => {
        uiStore.isLoading = true;
        error.value = null;

        try {
            const data = await playlistApi.fetchPlaylist(playlistId, userId);
            return data;
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Не удалось загрузить плейлист');
            console.error('Ошибка при загрузке плейлиста:', err);
            throw error.value;
        } finally {
            uiStore.isLoading = false;
        }
    };

    const removeVideoFromPlaylist = async (request: RemoveVideoFromPlaylistRequest): Promise<boolean> => {
        uiStore.isLoading = true;
        error.value = null;

        try {
            const result = await playlistApi.removeVideoFromPlaylist(request);
            return result.success;
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Не удалось удалить видео из плейлиста');
            console.error('Ошибка при удалении видео из плейлиста:', err);
            throw error.value;
        } finally {
            uiStore.isLoading = false;
        }
    };

    const createPlaylist = async (playlistData: CreatePlaylistRequest): Promise<Playlist> => {
        uiStore.isLoading = true;
        error.value = null;

        try {
            const playlist = await playlistApi.createPlaylist(playlistData);

            // После создания нового плейлиста, принудительно обновляем список
            await fetchUserPlaylists(playlistData.user_id);

            return playlist;
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Не удалось создать плейлист');
            console.error('Ошибка при создании плейлиста:', err);
            throw error.value;
        } finally {
            uiStore.isLoading = false;
        }
    };

    const addVideoToPlaylist = async (request: AddVideoToPlaylistRequest) => {
        uiStore.isLoading = true;
        error.value = null;
        try {
            const result = await playlistApi.addVideoToPlaylist(request);
            await fetchUserPlaylists(request.user_id);
            return result;
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Не удалось добавить видео в плейлист');
            console.error('Ошибка при добавлении видео в плейлист:', err);
            throw error.value;
        } finally {
            uiStore.isLoading = false;
        }
    };

    const updatePlaylist = async (data: UpdatePlaylistRequest): Promise<Playlist> => {
        uiStore.isLoading = true;
        error.value = null;
        try {
            const playlist = await playlistApi.updatePlaylist(data);
            // После обновления — обновляем список плейлистов пользователя
            await fetchUserPlaylists(data.user_id);
            return playlist;
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Не удалось обновить плейлист');
            console.error('Ошибка при обновлении плейлиста:', err);
            throw error.value;
        } finally {
            uiStore.isLoading = false;
        }
    };

    const fetchSubscribedPlaylists = async (userId: string) => {
        uiStore.isLoading = true;
        error.value = null;
        try {
            const data = await playlistApi.fetchSubscribedPlaylists(userId);
            subscribedPlaylists.value = data;
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Не удалось получить подписанные плейлисты');
            console.error('Ошибка при получении подписанных плейлистов:', err);
        } finally {
            uiStore.isLoading = false;
        }
    };

    const isSubscribedToPlaylist = async (userId: string, playlistId: string): Promise<boolean> => {
        try {
            return await playlistApi.isSubscribedToPlaylist(userId, playlistId);
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Не удалось проверить подписку на плейлист');
            console.error('Ошибка при проверке подписки на плейлист:', err);
            return false;
        }
    };

    const subscribeToPlaylist = async (userId: string, playlistId: string) => {
        uiStore.isLoading = true;
        error.value = null;
        try {
            await playlistApi.subscribeToPlaylist(userId, playlistId);
            await fetchSubscribedPlaylists(userId);
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Не удалось подписаться на плейлист');
            console.error('Ошибка при подписке на плейлист:', err);
            throw error.value;
        } finally {
            uiStore.isLoading = false;
        }
    };

    const unsubscribeFromPlaylist = async (userId: string, playlistId: string) => {
        uiStore.isLoading = true;
        error.value = null;
        try {
            await playlistApi.unsubscribeFromPlaylist(userId, playlistId);
            await fetchSubscribedPlaylists(userId);
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Не удалось отписаться от плейлиста');
            console.error('Ошибка при отписке от плейлиста:', err);
            throw error.value;
        } finally {
            uiStore.isLoading = false;
        }
    };

    const fetchAllPublicPlaylists = async () => {
        uiStore.isLoading = true;
        error.value = null;
        try {
            const data = await playlistApi.fetchAllPublicPlaylists();
            allPublicPlaylists.value = data;
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Не удалось загрузить публичные плейлисты');
            console.error('Ошибка при загрузке публичных плейлистов:', err);
        } finally {
            uiStore.isLoading = false;
        }
    };

    const fetchAllUserPlaylists = async (userId: string) => {
        uiStore.isLoading = true;
        error.value = null;
        try {
            const data = await playlistApi.fetchAllUserPlaylists(userId);
            allUserPlaylists.value = data;
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Не удалось получить все плейлисты пользователя');
            console.error('Ошибка при получении всех плейлистов пользователя:', err);
        } finally {
            uiStore.isLoading = false;
        }
    };

    return {
        playlists,
        error,
        fetchUserPlaylists,
        fetchPlaylist,
        removeVideoFromPlaylist,
        createPlaylist,
        addVideoToPlaylist,
        updatePlaylist,
        subscribedPlaylists,
        fetchSubscribedPlaylists,
        subscribeToPlaylist,
        unsubscribeFromPlaylist,
        allPublicPlaylists,
        fetchAllPublicPlaylists,
        isSubscribedToPlaylist,
        allUserPlaylists,
        fetchAllUserPlaylists
    };
});