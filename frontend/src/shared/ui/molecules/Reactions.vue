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
import { ref } from 'vue';
import { useReactionStore } from '../../../features/video/stores/reactionStore';
import { useUserStore } from '../../../features/user/stores/userStore';
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

// Методы
const handleReaction = async (type: 'like' | 'dislike') => {
    try {
        let data;
        if (props.entityType === 'video') {
            data = await reactionStore.addReaction(props.targetId, userStore.user?.id || '', type);
        } else if (props.entityType === 'comment') {
            data = await reactionStore.addReactionComment(props.targetId, userStore.user?.id || '', type);
        }
        if (data) {
            switch (data.action) {
                case 'added':
                    if (type === 'like') likes_count.value++;
                    else dislikes_count.value++;
                    break;
                case 'removed':
                    if (type === 'like') likes_count.value--;
                    else dislikes_count.value--;
                    break;
                case 'updated':
                    if (type === 'like') {
                        likes_count.value++;
                        dislikes_count.value--;
                    } else {
                        dislikes_count.value++;
                        likes_count.value--;
                    }
                    break;
            }
        }
    } catch (error) {
        console.error("Ошибка при обработке реакции:", error);
    }
};
</script>