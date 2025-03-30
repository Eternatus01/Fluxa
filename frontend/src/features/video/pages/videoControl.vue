<template>
    <div class="min-h-screen text-white">
        <main class="pt-12 px-4 container mx-auto">
            <div v-if="videoData" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Левая колонка - Форма редактирования -->
                <VideoEditForm :video="videoData" :is-saving="isSaving" @save="handleSave" @reset="handleReset" />

                <!-- Правая колонка - Предпросмотр -->
                <VideoPreview :video="videoData" />
            </div>
            <div v-else class="text-center py-8">
                <p class="text-gray-400">Загрузка данных видео...</p>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useVideoStore } from '../stores/videoStore'
import { useUserStore } from '../../user/stores/userStore'
import VideoEditForm from '../components/control/VideoEditForm.vue'
import VideoPreview from '../components/control/VideoPreview.vue'
import type { Video } from '../types/videoTypes'

const route = useRoute()
const videoStore = useVideoStore()
const userStore = useUserStore()

const videoData = ref<Video | null>(null)
const isSaving = ref(false)

// Загрузка данных видео
onMounted(async () => {
    try {
        // Получаем ID пользователя из хранилища или используем пустую строку как запасной вариант
        const userId = userStore.user?.id || '';
        const video = await videoStore.fetchVideo(route.params.id as string, userId)
        videoData.value = video
    } catch (error) {
        console.error("Ошибка при загрузке данных видео:", error)
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