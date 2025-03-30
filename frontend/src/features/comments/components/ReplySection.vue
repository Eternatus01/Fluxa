<template>
    <div>
        <!-- Форма для ответа -->
        <div v-if="isReplyFormVisible" class="mt-4">
            <textarea v-model="replyText" placeholder="Напишите ответ..."
                class="w-full bg-gray-800 rounded-lg p-3 text-white border border-gray-700 focus:outline-none focus:border-purple-600 resize-none"></textarea>

            <Button text="Ответить" variant="primary" @click="submitReply" />
        </div>

        <!-- Кнопка "Показать ответы" -->
        <p v-if="replyCount > 0" @click="toggleReplies" class="cursor-pointer text-blue-400">
            {{ areRepliesVisible ? "Скрыть ответы" : `Показать ответы (${replyCount})` }}
        </p>

        <!-- Отображение ответов -->
        <div v-if="areRepliesVisible" class="ml-8 mt-4">
            <div v-for="reply in replies" :key="reply.id" class="mb-4">
                <div class="flex items-start space-x-4">
                    <Avatar :src="reply.user?.avatar_url || ''" />
                    <div class="flex-1">
                        <div class="flex justify-between">
                            <div>
                                <span class="font-semibold mr-2">@{{ reply.user?.username }}</span>
                                <TimeAgo class="text-gray-300 text-sm" :date="reply.created_at || ''" />
                                <p class="video-description">{{ reply.text }}</p>
                            </div>

                            <delete-button v-if="videoUserId === userId" @click="handleDeleteReply(reply.id)" />
                        </div>

                        <Reactions :targetId="reply.id" :initialLikes="reply.likes_count || 0"
                            :initialDislikes="reply.dislikes_count || 0" entityType="comment" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Avatar from './../../../shared/ui/atoms/Avatar.vue';
import Button from './../../../shared/ui/atoms/Button.vue';
import TimeAgo from './../../../shared/ui/atoms/TimeAgo.vue';
import DeleteButton from './../../../shared/ui/atoms/DeleteButton.vue';
import Reactions from '../../../shared/ui/molecules/Reactions.vue';
import type { Comment } from '../types/Comment';
import { useCommentsStore } from '../stores/commentsStore';

// Пропсы
const props = defineProps<{
    commentId: string; // ID родительского комментария
    replies: Comment[]; // Список ответов
    replyCount: number; // Количество ответов
    videoUserId: string; // ID владельца видео
    userId: string; // ID текущего пользователя
    isReplyFormVisible: boolean; // Состояние видимости формы ответа
}>();

// События
const emit = defineEmits<{
    (event: 'add-reply', text: string): void;
    (event: 'delete-reply', replyId: string): void;
    (event: 'update-replies', replies: Comment[]): void;
    (event: 'toggle-reply'): void; // Событие для переключения видимости формы
}>();

// Локальные состояния
const replyText = ref('');
const areRepliesVisible = ref(false);
const commentsStore = useCommentsStore();

// Методы
const submitReply = () => {
    if (replyText.value.trim() === '') return;
    emit('add-reply', replyText.value);
    replyText.value = '';
    emit('toggle-reply'); // Скрываем форму после отправки
    getReplies();
    areRepliesVisible.value = true;
};

const toggleReplies = () => {
    if (!areRepliesVisible.value) {
        getReplies();
    }
    areRepliesVisible.value = !areRepliesVisible.value;
};

const getReplies = async () => {
    try {
        const replies = await commentsStore.getReplies(props.commentId);
        emit('update-replies', replies);
    } catch (error) {
        console.error("Ошибка при загрузке ответов:", error);
    }
};

const handleDeleteReply = async (replyId: string) => {
    try {
        emit('delete-reply', replyId);
    } catch (error) {
        console.error("Ошибка при удалении ответа:", error);
    }
};
</script>

<style scoped></style>