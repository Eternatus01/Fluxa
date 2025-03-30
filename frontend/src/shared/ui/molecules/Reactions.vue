<template>
    <div class="flex items-center space-x-4">
        <div class="flex gap-2">
            <span class="text-[18px]">{{ likes_count }}</span>
            <icon-like @click="handleReaction('like')"></icon-like>
        </div>
        <div class="flex gap-2">
            <span class="text-[18px]">{{ dislikes_count }}</span>
            <icon-dislike @click="handleReaction('dislike')"></icon-dislike>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useReactionStore } from '../../../features/reactions/stores/reactionStore';
import { useUserStore } from '../../../features/user/stores/userStore';
import { ReactionType } from '../../../features/reactions/types';
import IconLike from '../atoms/IconLike.vue';
import IconDislike from '../atoms/IconDislike.vue';

// Пропсы
const props = defineProps<{
    targetId: string; // ID видео или комментария
    initialLikes: number; // Начальное количество лайков
    initialDislikes: number; // Начальное количество дизлайков
    entityType: 'video' | 'comment'; // Тип сущности (видео или комментарий)
}>();

// Сторы
const reactionStore = useReactionStore();
const userStore = useUserStore();

// Локальные состояния
const likes_count = ref(props.initialLikes);
const dislikes_count = ref(props.initialDislikes);
const isLoading = ref(false);

// При монтировании компонента загружаем актуальные данные о реакциях
onMounted(async () => {
    try {
        if (props.entityType === 'video') {
            await reactionStore.fetchReactions(props.targetId);
            const reactions = reactionStore.getVideoReactions(props.targetId);
            if (reactions) {
                likes_count.value = reactions.likes || reactions.likes_count || 0;
                dislikes_count.value = reactions.dislikes || reactions.dislikes_count || 0;
            }
        } else if (props.entityType === 'comment') {
            await reactionStore.fetchReactionsComment(props.targetId);
            const reactions = reactionStore.getCommentReactions(props.targetId);
            if (reactions) {
                likes_count.value = reactions.likes || reactions.likes_count || 0;
                dislikes_count.value = reactions.dislikes || reactions.dislikes_count || 0;
            }
        }
    } catch (error) {
        console.error("Ошибка при загрузке реакций:", error);
    }
});

// Методы
const handleReaction = async (type: ReactionType) => {
    if (!userStore.user?.id) {
        // Если пользователь не авторизован, показываем сообщение или перенаправляем на страницу входа
        return;
    }

    if (isLoading.value) {
        return; // Предотвращаем множественные нажатия
    }

    isLoading.value = true;
    try {
        if (props.entityType === 'video') {
            await reactionStore.addReaction(props.targetId, userStore.user.id, type);
            const reactions = reactionStore.getVideoReactions(props.targetId);
            if (reactions) {
                likes_count.value = reactions.likes || reactions.likes_count || 0;
                dislikes_count.value = reactions.dislikes || reactions.dislikes_count || 0;
            }
        } else if (props.entityType === 'comment') {
            await reactionStore.addReactionComment(props.targetId, userStore.user.id, type);
            const reactions = reactionStore.getCommentReactions(props.targetId);
            if (reactions) {
                likes_count.value = reactions.likes || reactions.likes_count || 0;
                dislikes_count.value = reactions.dislikes || reactions.dislikes_count || 0;
            }
        }
    } catch (error) {
        console.error("Ошибка при обработке реакции:", error);
    } finally {
        isLoading.value = false;
    }
};
</script>