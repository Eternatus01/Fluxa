<template>
    <div class="mb-6">
        <h2 v-if="video.type !== 'public'">{{ video.type }}</h2>
        <h1 class="text-2xl font-semibold mb-2">{{ video.title }}</h1>
        <div class="flex items-center justify-between mb-4">
            <Reactions :targetId="video.id" :initialLikes="video.likes_count" :initialDislikes="video.dislikes_count"
                entityType="video" />
            <p class="text-gray-200 text-sm">{{ video.views }} просмотров •
                <TimeAgo :date="video.created_at" />
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