import { useUploadApi } from "../composable/useUploadApi";
import { useVideoStore } from "./videoStore";
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUploadStore = defineStore("upload", () => {
    const uploadApi = useUploadApi();
    const videoStore = useVideoStore();
    
    const isUploading = ref(false);
    const uploadProgress = ref(0);
    const uploadError = ref<Error | null>(null);

    const uploadVideo = async (
        videoFile: File, 
        thumbnailFile: File, 
        user_id: string, 
        title: string, 
        description: string, 
        tags: string[], 
        videoType: string
    ) => {
        isUploading.value = true;
        uploadProgress.value = 0;
        uploadError.value = null;
        
        try {
            const progressInterval = setInterval(() => {
                if (uploadProgress.value < 90) {
                    uploadProgress.value += 5;
                }
            }, 500);
            
            const data = await uploadApi.uploadVideo(
                videoFile, 
                thumbnailFile, 
                user_id, 
                title, 
                description, 
                tags, 
                videoType
            );
            
            clearInterval(progressInterval);
            uploadProgress.value = 100;
            
            // Обновляем кэш видео после успешной загрузки
            try {
                await videoStore.fetchVideos();
                await videoStore.fetchUserVideos(user_id);
            } catch (cacheError) {
                console.warn('Ошибка при обновлении кэша:', cacheError);
                // Не прерываем выполнение, так как видео уже загружено
            }
            
            return data;
        } catch (error) {
            console.error("Ошибка при загрузке видео:", error);
            uploadError.value = error as Error;
            throw error;
        } finally {
            isUploading.value = false;
        }
    };

    const resetUploadState = () => {
        isUploading.value = false;
        uploadProgress.value = 0;
        uploadError.value = null;
    };

    return {
        uploadVideo,
        resetUploadState,
        isUploading: computed(() => isUploading.value),
        uploadProgress: computed(() => uploadProgress.value),
        uploadError: computed(() => uploadError.value),
    };
});