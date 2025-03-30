<script setup lang="ts">
import type { Comment } from '../type/Comment';
import CommentHeader from './CommentHeader.vue';
import CommentActions from './CommentActions.vue';

defineProps<{
    replies: Comment[];
    videoUserId: string;
    userId: string;
}>();

const emit = defineEmits<{
    (e: 'delete', replyId: string): void;
}>();
</script>

<template>
    <div class="ml-8 mt-4">
        <div v-for="reply in replies" :key="reply.id" class="mb-4">
            <div class="flex-1">
                <CommentHeader :username="reply.user?.username" :avatarUrl="reply.user?.avatar_url || ''"
                    :createdAt="reply.created_at || ''" :canDelete="videoUserId === userId"
                    @delete="$emit('delete', reply.id)" />
                <p class="video-description">{{ reply.text }}</p>
                <CommentActions :commentId="reply.id" :likesCount="reply.likes_count || 0"
                    :dislikesCount="reply.dislikes_count || 0" />
            </div>
        </div>
    </div>
</template>