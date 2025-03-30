<template>
    <button :class="buttonClass" class="transition-all" @click="onClick">
        {{ text }}
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Пропсы
const props = defineProps<{
    text: string; // Текст кнопки
    onClick: () => void; // Обработчик клика
    variant?: 'primary' | 'secondary' | 'danger'; // Вариант стиля
}>();

// Классы кнопки
const buttonClass = computed(() => {
    const baseClass = 'flex items-center px-4 py-2 rounded-lg cursor-pointer';
    switch (props.variant) {
        case 'primary':
            return `${baseClass} bg-blue-500 text-white hover:bg-blue-600`;
        case 'secondary':
            return `${baseClass} bg-gray-500 text-white hover:bg-gray-600`;
        case 'danger':
            return `${baseClass} bg-red-500 text-white hover:bg-red-600`;
        default:
            return baseClass;
    }
});
</script>