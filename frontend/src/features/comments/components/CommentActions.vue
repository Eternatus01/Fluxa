<script setup lang="ts">
import Reactions from '@/shared/ui/molecules/Reactions.vue';

defineProps<{
    commentId: string;
    likesCount: number;
    dislikesCount: number;
}>();

const emit = defineEmits<{
    (e: 'reply'): void;
}>();
</script>

<template>
    <div class="flex gap-4">
        <Reactions :targetId="commentId" :initialLikes="likesCount" :initialDislikes="dislikesCount"
            entityType="comment" />
        <p @click="$emit('reply')" class="cursor-pointer">Ответить</p>
    </div>
</template>