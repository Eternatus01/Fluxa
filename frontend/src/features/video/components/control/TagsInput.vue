<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const props = defineProps<{
    modelValue: string;
    error?: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const inputValue = ref(props.modelValue);
const MAX_TAGS = 15;
const MAX_TAG_LENGTH = 20;

// Проверка валидности ввода
const isValid = computed(() => {
    const tags = getTags(inputValue.value);
    return tags.length <= MAX_TAGS &&
        tags.every(tag => tag.length <= MAX_TAG_LENGTH) &&
        tags.every(tag => /^[a-zA-Z0-9а-яА-ЯёЁ\-_]+$/u.test(tag));
});

// Получение массива тегов из строки
const getTags = (value: string): string[] => {
    return value.split(',')
        .map(tag => sanitizeTag(tag.trim()))
        .filter(tag => tag.length > 0);
};

// Санитизация тега
const sanitizeTag = (tag: string): string => {
    return tag
        .replace(/<[^>]*>/g, '') // Удаляем HTML теги
        .replace(/[^\w\sа-яА-ЯёЁ\-_]/gu, '') // Оставляем только буквы, цифры и некоторые символы
        .substring(0, MAX_TAG_LENGTH); // Ограничиваем длину
};

// Обновляем локальное значение при изменении props
watch(() => props.modelValue, (newValue) => {
    inputValue.value = newValue;
});

const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    // Очищаем и форматируем ввод
    const processedValue = processTags(input.value);
    inputValue.value = processedValue;
    emit('update:modelValue', processedValue);
};

// Обработка и форматирование строки тегов
const processTags = (value: string): string => {
    // Получаем теги и ограничиваем их количество
    const tags = getTags(value).slice(0, MAX_TAGS);
    // Возвращаем теги обратно в строку
    return tags.join(', ');
};
</script>

<template>
    <div>
        <label class="block text-sm font-medium mb-2 text-gray-200">Теги (через запятую)</label>
        <input type="text" :value="inputValue" @input="handleInput"
            class="w-full p-3 bg-[#252525] rounded-lg border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
            :class="{ 'border-red-500 focus:ring-red-500': error || !isValid }" placeholder="gaming, tutorial, vlog">
        <p v-if="error" class="text-red-400 text-sm mt-1">{{ error }}</p>
        <p v-else-if="!isValid" class="text-red-400 text-sm mt-1">
            Теги должны содержать только буквы, цифры и символы -_. Максимум {{ MAX_TAGS }} тегов.
        </p>
        <p v-else class="text-xs text-gray-400 mt-1">
            Разделяйте теги запятыми. Максимум {{ MAX_TAGS }} тегов, каждый до {{ MAX_TAG_LENGTH }} символов.
        </p>

        <div class="mt-3 flex flex-wrap gap-2" v-if="inputValue">
            <span v-for="tag in getTags(inputValue)" :key="tag"
                class="px-3 py-1 bg-[#252525] rounded-full text-xs text-blue-400">
                #{{ tag }}
            </span>
        </div>
    </div>
</template>