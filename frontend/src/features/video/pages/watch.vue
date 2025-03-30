<template>
    <div class="min-h-screen">
        <div class="container mx-auto px-1 lg:px-2 py-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Основная секция -->
                <div class="lg:col-span-2" v-if="video">
                    <video-player :video="video" />
                    <video-info :video="video" />
                    <channel-info :user="user" :video="video" class="mb-3" />
                    <Comments :video_id="video.id" :user_id="user_id" :video_userId="video.user_id" />
                </div>

                <div class="lg:col-span-2" v-else="video">
                    У вас нет доступа к видео
                </div>

                <!-- Рекомендации -->
                <div class="lg:col-span-1">
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
import { useReactionStore } from '../../video/stores/reactionStore';

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