<template>
    <div class="min-h-screen">
        <LoadingState v-if="uiStore.isLoading" />
        <main v-else class="container mx-auto px-4 py-8">
            <div v-if="videoData" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- Левая колонка - Форма редактирования -->
                <div class="lg:col-span-7 xl:col-span-8">
                    <VideoEditForm :video="videoData" :is-saving="isSaving" @save="handleSave" @reset="handleReset" />
                </div>

                <!-- Правая колонка - Предпросмотр -->
                <div class="lg:col-span-5 xl:col-span-4">
                    <VideoPreview :video="videoData" />
                </div>
            </div>

            <div v-else class="flex items-center justify-center min-h-[50vh]">
                <div class="text-center bg-[#1e1e1e]/60 p-10 rounded-lg max-w-md">
                    <div class="animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-blue-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p class="text-gray-300 text-lg mb-2">Загрузка данных видео</p>
                    <p class="text-gray-400 text-sm">Пожалуйста, подождите...</p>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVideoStore } from '../stores/videoStore'
import { useUserStore } from '../../user/stores/userStore'
import VideoEditForm from '../components/control/VideoEditForm.vue'
import VideoPreview from '../components/control/VideoPreview.vue'
import type { Video } from '../types/videoTypes'
import { useUiStore } from '@/shared/stores/uiStore';
import LoadingState from '@/shared/ui/molecules/LoadingState.vue';

const route = useRoute()
const router = useRouter()
const videoStore = useVideoStore()
const userStore = useUserStore()
const uiStore = useUiStore();

const videoData = ref<Video | null>(null)
const isSaving = ref(false)

// Загрузка данных видео
onMounted(async () => {
    uiStore.isLoading = true;
    try {
        // Получаем ID пользователя из хранилища или используем пустую строку как запасной вариант
        const userId = userStore.user?.id || '';
        const video = await videoStore.fetchVideo(route.params.id as string, userId)

        // Проверяем, принадлежит ли видео текущему пользователю
        if (userStore.user?.id !== video.user_id) {
            // Если нет, перенаправляем на страницу просмотра
            router.push(`/watch/${video.id}`);
            return;
        }

        videoData.value = video
    } catch (error) {
        console.error("Ошибка при загрузке данных видео:", error)
    } finally {
        uiStore.isLoading = false;
    }
})

const handleSave = async (data: Partial<Video>) => {
    if (!videoData.value) return

    // Проверяем наличие и корректность тегов
    console.log('handleSave получил данные:', data);
    console.log('Теги из данных:', data.tags);

    if (!data.tags) {
        console.warn('Предупреждение: теги отсутствуют в переданных данных');
    } else if (!Array.isArray(data.tags)) {
        console.error('Ошибка: теги не являются массивом:', data.tags);
    } else {
        console.log('Количество тегов:', data.tags.length);
    }

    isSaving.value = true
    try {
        // Отладочное логирование
        console.log('Данные из формы:', data);
        console.log('Теги из формы:', data.tags);

        // Создаем объект, соответствующий интерфейсу VideoUpdate
        await videoStore.updateVideo({
            video_id: videoData.value.id,
            user_id: videoData.value.user_id,
            title: data.title || videoData.value.title,
            description: data.description || videoData.value.description || '',
            thumbnail_file: data.thumbnailFile,
            video_url: videoData.value.video_url,
            thumbnailOldPath: videoData.value.thumbnail_url,
            tags: data.tags || videoData.value.tags || [],
            type: data.videoType || videoData.value.videoType || 'public'
        })

        // Обновляем локальные данные в соответствии с обновлениями
        if (videoData.value) {
            videoData.value = {
                ...videoData.value,
                ...data
            };
        }

        console.log('Видео успешно обновлено. Новые теги:', videoData.value?.tags);
    } catch (error) {
        console.error("Ошибка при сохранении видео:", error)
    } finally {
        isSaving.value = false
    }
}

const handleReset = () => {
    // Сброс формы происходит внутри компонента VideoEditForm
}
</script>