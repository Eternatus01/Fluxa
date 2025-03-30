<template>
    <div>
        <h2 class="text-xl font-semibold mb-4">Похожие видео</h2>
        <div class="space-y-4">
            <div v-for="video in videos" :key="video.id" class="flex space-x-4">
                <img :src="video.thumbnail_url" class="w-40 h-24 object-cover rounded-lg" alt="Related Video Thumbnail">
                <div>
                    <h3 class="text-sm font-semibold">{{ video.title }}</h3>
                    <p class="text-gray-400 text-xs">{{ video.channel_name }}</p>
                    <p class="text-gray-500 text-xs">{{ video.views }} •
                        <TimeAgo :date="video.created_at" />
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import TimeAgo from './../../../shared/ui/atoms/TimeAgo.vue';

defineProps({
    videos: {
        type: Array,
        required: true,
    },
});
</script>