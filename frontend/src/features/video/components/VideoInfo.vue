<template>
    <div class="mb-6 bg-[#1e1e1e]/60 p-4 rounded-lg">
        <div v-if="video.type !== 'public'"
            class="inline-block px-2 py-1 mb-2 text-xs font-medium bg-blue-600/80 text-white rounded">
            {{ video.type }}
        </div>
        <h1 class="text-xl md:text-2xl font-semibold mb-3 text-white">{{ video.title }}</h1>
        <div class="flex flex-wrap items-center justify-between gap-4">
            <Reactions :targetId="video.id" :initialLikes="video.likes_count" :initialDislikes="video.dislikes_count"
                entityType="video" class="flex items-center space-x-4" />
            <p class="text-gray-300 text-sm flex items-center gap-2">
                <span class="font-medium">{{ video.views }} просмотров</span>
                <span class="w-1 h-1 bg-gray-500 rounded-full"></span>
                <TimeAgo :date="video.created_at" class="text-gray-400" />
            </p>
        </div>
    </div>
</template>

<script setup>
import TimeAgo from './../../../shared/ui/atoms/TimeAgo.vue';
import Reactions from '../../../shared/ui/molecules/Reactions.vue';

const props = defineProps({
    video: {
        type: Object,
        required: true,
    },
});
</script>