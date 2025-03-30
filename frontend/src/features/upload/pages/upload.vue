<template>
    <div class="min-h-screen">
        <main class="pt-12 px-4 container mx-auto">
            <UploadForm :is-uploading="isUploading" :upload-progress="uploadProgress" :upload-error="uploadError"
                @submit="handleUpload" />
        </main>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '../../user/stores/userStore';
import { useUploadStore } from '../stores/uploadStore';
import { storeToRefs } from 'pinia';
import UploadForm from '../../upload/components/UploadForm.vue';
import type { VideoUploadParams } from '../../video/types/videoTypes';

const userStore = useUserStore();
const uploadStore = useUploadStore();

// Получаем реактивные состояния из стора
const { isUploading, uploadProgress, uploadError } = storeToRefs(uploadStore);
const user_id = computed(() => userStore.user?.id);

const handleUpload = async (data: VideoUploadParams) => {
    try {
        if (!user_id.value) {
            alert('Необходимо авторизоваться');
            return;
        }

        await uploadStore.uploadVideo(
            data.videoFile,
            data.thumbnailFile!,
            user_id.value,
            data.title,
            data.description,
            data.tags,
            data.videoType
        );

        alert('Видео успешно загружено!');
    } catch (error) {
        console.error('Ошибка загрузки видео:', error);
    }
};
</script>

<style scoped></style>