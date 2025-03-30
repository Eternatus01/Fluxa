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
        const video = await videoStore.fetchVideo(route.params.id as string)
        videoData.value = video
    } catch (error) {
        console.error("Ошибка при загрузке данных видео:", error)
    }
})

const handleSave = async (data: Partial<Video>) => {
    if (!videoData.value) return

    isSaving.value = true
    try {
        const updatedVideo = await videoStore.updateVideo({
            ...videoData.value,
            ...data,
        })
        videoData.value = updatedVideo
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