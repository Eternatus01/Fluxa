<template>
    <div class="min-h-screen">
        <LoadingState v-if="uiStore.isLoading" />
        <main v-else class="container mx-auto px-4 py-8">
            <div class="max-w-4xl mx-auto">
                <h1 class="text-2xl md:text-3xl font-bold mb-6">Загрузка видео</h1>
                <UploadForm :is-uploading="isUploading" :upload-progress="uploadProgress" :upload-error="uploadError"
                    @submit="handleUpload" />
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../../user/stores/userStore';
import { useUploadStore } from '../stores/uploadStore';
import { storeToRefs } from 'pinia';
import UploadForm from '../../upload/components/UploadForm.vue';
import type { VideoUploadParams } from '../../video/types/videoTypes';
import { useRouter } from 'vue-router';
import { useUiStore } from '@/shared/stores/uiStore';
import LoadingState from '@/shared/ui/molecules/LoadingState.vue';

const userStore = useUserStore();
const uploadStore = useUploadStore();
const router = useRouter();
const uiStore = useUiStore();

// Получаем реактивные состояния из стора
const { isUploading, uploadProgress, uploadError } = storeToRefs(uploadStore);

const handleUpload = async (data: VideoUploadParams) => {
    uiStore.isLoading = true;
    try {
        const user = userStore.user;
        if (!user) {
            alert('Необходимо авторизоваться');
            return;
        }

        const userId = user.id || '';

        // Загружаем видео
        const result = await uploadStore.uploadVideo(
            data.videoFile,
            data.thumbnailFile!,
            userId,
            data.title,
            data.description || '',
            data.tags,
            data.videoType
        );

        if (result?.id) {
            // Перенаправляем на страницу видео после успешной загрузки
            router.push(`/watch/${result.id}`);
        }
    } catch (error) {
        console.error('Ошибка загрузки видео:', error);
    } finally {
        uiStore.isLoading = false;
    }
};
</script>

<style scoped></style>