<template>
    <div class="min-h-screen">
        <div class="container mx-auto px-4 py-6">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- Основная секция с видео и информацией -->
                <div class="lg:col-span-8" v-if="video">
                    <video-player :video="video" />
                    <video-info :video="video" />
                    <channel-info :user="user" :video="video" class="mb-6" />
                    <Comments :video_id="video.id" :user_id="user_id" :video_userId="video.user_id" />
                </div>

                <div v-else class="lg:col-span-8 p-8 bg-[#1e1e1e]/60 rounded-lg text-center">
                    <div class="text-xl font-medium text-gray-300 mb-2">У вас нет доступа к видео</div>
                    <p class="text-gray-400 text-sm">Возможно, видео было удалено или имеет ограниченный доступ</p>
                </div>

                <!-- Рекомендации и похожие видео -->
                <div class="lg:col-span-4">
                    <related-videos :videos="relatedVideos" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../../user/stores/userStore';
import { useVideoStore } from '../../video/stores/videoStore';
import VideoPlayer from '../components/VideoPlayer.vue';
import VideoInfo from '../components/VideoInfo.vue';
import ChannelInfo from '../components/ChannelInfo.vue';
import Comments from '../../comments/components/Comments.vue';
import RelatedVideos from '../components/RelatedVideos.vue';
import { useReactionStore } from '../../reactions/stores/reactionStore';

const userStore = useUserStore();
const videoStore = useVideoStore();
const reactionStore = useReactionStore();

const props = defineProps({
    id: String,
});

const video = ref(null);
const user = ref(null);
const user_id = computed(() => userStore.user_id)

// Рекомендованные видео (пример)
const relatedVideos = ref([
    { id: 2, title: 'Другое видео', thumbnail_url: 'URL_МИНИАТЮРЫ', channel_name: 'Канал', views: 500, created_at: '2025-02-19T12:00:00Z' },
    { id: 3, title: 'Еще одно', thumbnail_url: 'URL_МИНИАТЮРЫ', channel_name: 'Канал', views: 300, created_at: '2025-02-18T15:00:00Z' },
]);

// Загрузка данных видео
onMounted(async () => {
    try {
        // Загружаем видео без кэширования для получения актуальных данных
        const videoData = await videoStore.fetchVideo(props.id, user_id.value);
        video.value = videoData;

        // Загружаем данные пользователя
        const userData = await userStore.getUserById(videoData.user_id);
        user.value = userData;

        // Добавляем просмотр
        await videoStore.addView(videoData.id, userData.id);

        // Загружаем актуальные данные о реакциях
        await reactionStore.fetchReactions(props.id);
    } catch (error) {
        console.error("Ошибка при загрузке данных видео:", error);
    }
});
</script>