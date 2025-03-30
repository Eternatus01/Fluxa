<template>
    <div class="p-6 rounded-lg">
        <h2 class="text-xl font-semibold mb-4">Комментарии</h2>
        <CommentForm @submit="handleAddComment" />
        <div v-if="isLoading" class="text-center py-4">
            Загрузка комментариев...
        </div>
        <div v-else-if="comments.length === 0" class="text-center py-4">
            Нет комментариев. Будьте первым!
        </div>
        <div v-else v-for="comment in comments" :key="comment.id" class="mb-4">
            <CommentItem :comment="comment" :video_userId="video_userId" :user_id="user_id"
                @delete-comment="handleDeleteComment" @add-reply="handleAddReply" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCommentsStore } from '../stores/commentsStore';
import type { Comment } from '../type/Comment';
import CommentForm from './CommentForm.vue';
import CommentItem from './CommentItem.vue';

// Пропсы
const props = defineProps<{
    video_id: string;
    user_id: string;
    video_userId: string;
}>();

// Сторы
const commentsStore = useCommentsStore();

// Локальные состояния
const comments = ref<Comment[]>([]);
const isLoading = ref(false);

// Методы
const handleAddComment = async (text: string) => {
    try {
        isLoading.value = true;
        await commentsStore.addComment(props.video_id, props.user_id, text);
    } catch (error) {
        console.error("Ошибка при добавлении комментария:", error);
    } finally {
        isLoading.value = false;
    }
};

const handleDeleteComment = async (commentId: string) => {
    try {
        // Удаляем комментарий из локального состояния
        comments.value = comments.value.filter((comment) => comment.id !== commentId);

        // Обновляем счетчики ответов, если это был ответ на комментарий
        comments.value.forEach(comment => {
            if (comment.replies) {
                const wasReply = comment.replies.some(reply => reply.id === commentId);
                if (wasReply && comment.reply_count !== undefined) {
                    comment.reply_count -= 1;
                    comment.replies = comment.replies.filter(reply => reply.id !== commentId);
                }
            }
        });
        await commentsStore.deleteComment(commentId)
    } catch (error) {
        console.error("Ошибка при удалении комментария:", error);
    }
};

const handleAddReply = async (parentCommentId: string, text: string) => {
    try {
        const reply = await commentsStore.addComment(props.video_id, props.user_id, text, parentCommentId);

        if (reply) {
            const parentComment = comments.value.find((c) => c.id === parentCommentId);
            if (parentComment) {
                if (!parentComment.replies) {
                    parentComment.replies = [];
                }
                parentComment.replies.unshift(reply);

                // Увеличиваем счетчик ответов
                if (parentComment.reply_count !== undefined) {
                    parentComment.reply_count += 1;
                } else {
                    parentComment.reply_count = 1;
                }
            }
        }
    } catch (error) {
        console.error("Ошибка при добавлении ответа:", error);
    }
};

// Загрузка комментариев при монтировании компонента
onMounted(async () => {
    try {
        isLoading.value = true;
        const data = await commentsStore.fetchComments(props.video_id);

        if (data) {
            comments.value = data;
        }
    } catch (error) {
        console.error("Ошибка при загрузке комментариев:", error);
    } finally {
        isLoading.value = false;
    }
});
</script>