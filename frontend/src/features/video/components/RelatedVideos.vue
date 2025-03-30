<template>
    <div class="bg-[#1e1e1e]/60 p-4 rounded-lg">
        <h2 class="text-lg font-semibold mb-4 text-white">Похожие видео</h2>
        <div class="space-y-4">
            <router-link v-for="video in videos" :key="video.id" :to="`/watch/${video.id}`"
                class="flex gap-3 group hover:bg-[#252525]/70 p-2 rounded-lg transition-all">
                <div class="relative w-40 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <img :src="video.thumbnail_url"
                        class="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                        alt="Thumbnail">
                    <div
                        class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    </div>
                </div>

                <div class="flex-1 min-w-0">
                    <h3
                        class="text-sm font-medium text-white line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors duration-300">
                        {{ video.title }}
                    </h3>
                    <p class="text-xs text-gray-400 mt-1.5 truncate">{{ video.channel_name }}</p>
                    <div class="flex items-center text-[11px] text-gray-500 gap-2 mt-1">
                        <span>{{ video.views }} просмотров</span>
                        <span class="w-1 h-1 bg-gray-600 rounded-full"></span>
                        <TimeAgo :date="video.created_at" />
                    </div>
                </div>
            </router-link>
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