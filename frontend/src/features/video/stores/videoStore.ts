import { useVideoApi } from "../composable/useVideoApi";
import { defineStore } from 'pinia';
import { computed, ref, type Ref } from "vue";
import { Video, VideoError } from "../types/videoTypes";
import { useUiStore } from '@/shared/stores/uiStore';

interface VideoUpdate {
    video_id: string;
    user_id: string;
    title: string;
    description: string;
    thumbnail_file?: File;
    video_url?: string;
    thumbnailOldPath?: string;
    tags: string[];
    type: string;
}

export const useVideoStore = defineStore("video", () => {
    const videoApi = useVideoApi();
    const uiStore = useUiStore();

    // Реактивные состояния
    const videos: Ref<Video[] | null> = ref(null);
    const videosUser: Ref<Video[] | null> = ref(null);
    const video: Ref<Video | null> = ref(null);
    const error = ref<Error | null>(null);
    const searchResults = ref<Video[] | null>(null);

    // Утилита для обновления видео в списке
    const updateVideoInList = (
        videoList: Video[] | null,
        videoId: string,
        updateData: Partial<Video>
    ): Video[] | null => {
        if (!videoList) return null;

        return videoList.map(v =>
            v.id === videoId
                ? { ...v, ...updateData }
                : v
        );
    };

    // Утилита для обновления просмотров
    const updateViewCount = (videoId: string) => {
        // Обновляем в текущем видео
        if (video.value?.id === videoId) {
            video.value.views = ((video.value.views || 0) + 1);
        }

        // Обновляем в списках
        videos.value = updateVideoInList(videos.value, videoId, {
            views: ((videos.value?.find(v => v.id === videoId)?.views || 0) + 1)
        });

        videosUser.value = updateVideoInList(videosUser.value, videoId, {
            views: ((videosUser.value?.find(v => v.id === videoId)?.views || 0) + 1)
        });
    };

    // Утилита для обновления данных видео
    const updateVideoData = (videoId: string, updateData: Partial<Video>) => {
        // Обновляем в текущем видео
        if (video.value?.id === videoId) {
            video.value = { ...video.value, ...updateData };
        }

        // Обновляем в списках
        videos.value = updateVideoInList(videos.value, videoId, updateData);
        videosUser.value = updateVideoInList(videosUser.value, videoId, updateData);
    };

    // Загрузка всех видео
    const fetchVideos = async () => {
        uiStore.isLoading = true;
        error.value = null;

        try {
            const data = await videoApi.fetchVideos();
            videos.value = data;
            return data;
        } catch (err) {
            error.value = err as Error;
            videos.value = null;
            throw err;
        } finally {
            uiStore.isLoading = false;
        }
    };

    // Загрузка видео пользователя
    const fetchUserVideos = async (user_id: string | undefined) => {
        if (!user_id) {
            error.value = new Error('ID пользователя не указан');
            return null;
        }

        uiStore.isLoading = true;
        error.value = null;

        try {
            const data = await videoApi.fetchUserVideos(user_id);
            videosUser.value = data;
            return data;
        } catch (err) {
            error.value = err as Error;
            videosUser.value = null;
            throw err;
        } finally {
            uiStore.isLoading = false;
        }
    };

    // Загрузка конкретного видео
    const fetchVideo = async (id: string, user_id: string) => {
        uiStore.isLoading = true;
        error.value = null;

        try {
            const data = await videoApi.fetchVideo(id, user_id);
            video.value = data;
            return data;
        } catch (err) {
            error.value = err as Error;
            video.value = null;
            throw err;
        } finally {
            uiStore.isLoading = false;
        }
    };

    // Добавление просмотра
    const addView = async (video_id: string, user_id: string): Promise<void> => {
        try {
            await videoApi.addView(video_id, user_id);
        } catch (err) {
            error.value = err as Error;
            throw err;
        }
    };

    // Обновление видео
    const updateVideo = async (data: VideoUpdate) => {
        const { video_id, user_id, title, description, thumbnail_file, video_url, thumbnailOldPath, tags, type } = data;

        uiStore.isLoading = true;
        error.value = null;

        try {
            await videoApi.updateVideo(
                video_id,
                user_id,
                title,
                description,
                thumbnail_file,
                video_url,
                thumbnailOldPath,
                tags,
                type
            );

            const updateData = {
                title,
                description,
                tags,
                thumbnail_url: thumbnail_file
                    ? URL.createObjectURL(thumbnail_file)
                    : video.value?.thumbnail_url
            };

            updateVideoData(video_id, updateData);
        } catch (err) {
            error.value = err as Error;
            throw err;
        } finally {
            uiStore.isLoading = false;
        }
    };

    // Очистка состояния
    const clearVideos = () => {
        videos.value = null;
        videosUser.value = null;
        video.value = null;
        error.value = null;
    };

    // Очистка кэша
    const clearCache = () => {
        videoApi.clearVideoCache();
    };

    // Поиск видео
    const searchVideos = async (query: string) => {
        uiStore.isLoading = true;
        error.value = null;

        try {
            console.log('Запрос поиска:', query);
            const data = await videoApi.searchVideos(query);
            console.log('Результаты поиска API:', data);
            videos.value = data;
            console.log('Обновлен videos.value:', videos.value);
            return data;
        } catch (err) {
            error.value = err as Error;
            searchResults.value = null;
            throw err;
        } finally {
            uiStore.isLoading = false;
        }
    };

    // Загрузка видео по подпискам
    const fetchSubscribedVideos = async (user_id: string) => {
        uiStore.isLoading = true;
        error.value = null;
        try {
            const data = await videoApi.fetchSubscribedVideos(user_id);
            videos.value = data;
            console.log(videos.value);
            return data;
        } catch (err) {
            error.value = err as Error;
            videos.value = null;
            throw err;
        } finally {
            uiStore.isLoading = false;
        }
    };

    return {
        videos: computed(() => videos.value),
        videosUser: computed(() => videosUser.value),
        video: computed(() => video.value),
        error: computed(() => error.value),
        searchResults: computed(() => searchResults.value),
        fetchVideos,
        fetchUserVideos,
        fetchVideo,
        addView,
        updateVideo,
        clearVideos,
        clearCache,
        searchVideos,
        fetchSubscribedVideos,
    };
});