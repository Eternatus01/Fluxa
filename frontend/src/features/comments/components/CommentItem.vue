<template>
    <div class="comment-item">
        <div class="flex-1">
            <CommentHeader :username="comment.user?.username" :avatarUrl="comment.user?.avatar_url || ''"
                :createdAt="comment.created_at || ''" :canDelete="video_userId === user_id"
                @delete="handleDeleteComment" />

            <p class="video-description mt-2">{{ comment.text }}</p>

            <CommentActions :commentId="comment.id" :likesCount="comment.likes_count || 0"
                :dislikesCount="comment.dislikes_count || 0" @reply="toggleReply" />

            <ReplyForm v-if="isReplyFormVisible" :videoId="video_id" :parentId="comment.id"
                @success="handleReplySuccess" @cancel="toggleReply" />

            <!-- Кнопка "Показать ответы" -->
            <p v-if="reply_count > 0" @click="toggleReplies" class="cursor-pointer text-blue-400 mt-2">
                {{ areRepliesVisible ? "Скрыть ответы" : `Показать ответы (${reply_count})` }}
            </p>

            <ReplyList v-if="areRepliesVisible" :replies="comment.replies || []" :videoUserId="video_userId"
                :userId="user_id" @delete="handleDeleteReply" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Comment } from '../type/Comment';
import CommentHeader from './CommentHeader.vue';
import CommentActions from './CommentActions.vue';
import ReplyForm from './ReplyForm.vue';
import ReplyList from './ReplyList.vue';
import { useCommentsStore } from '../stores/commentsStore';

// Пропсы
const props = defineProps<{
    comment: Comment;
    video_userId: string;
    user_id: string;
    video_id: string;
}>();

// События
const emit = defineEmits<{
    (event: 'delete-comment', commentId: string): void;
}>();

const commentsStore = useCommentsStore();
const reply_count = ref(props.comment.reply_count || 0);
const isReplyFormVisible = ref(false);
const areRepliesVisible = ref(false);

// Методы
const toggleReply = () => {
    isReplyFormVisible.value = !isReplyFormVisible.value;
};

const handleReplySuccess = async () => {
    reply_count.value += 1;
    isReplyFormVisible.value = false;
    await getReplies();
    areRepliesVisible.value = true;
};

const getReplies = async () => {
    try {
        const replies = await commentsStore.getReplies(props.comment.id);
        props.comment.replies = replies;
    } catch (error) {
        console.error("Ошибка при загрузке ответов:", error);
    }
}

const handleDeleteReply = (replyId: string) => {
    emit('delete-comment', replyId);
    reply_count.value -= 1;
};

const handleDeleteComment = () => {
    emit('delete-comment', props.comment.id);
};

const toggleReplies = () => {
    if (!areRepliesVisible.value && !props.comment.replies?.length) {
        getReplies()
    }
    areRepliesVisible.value = !areRepliesVisible.value;
};
</script>

<style scoped>
.comment-item {
    margin-bottom: 1rem;
}
</style>