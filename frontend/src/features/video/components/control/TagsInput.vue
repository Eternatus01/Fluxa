<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
    modelValue: string;
    error?: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const inputValue = ref(props.modelValue);

// Обновляем локальное значение при изменении props
watch(() => props.modelValue, (newValue) => {
    inputValue.value = newValue;
});

const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    inputValue.value = input.value;
    emit('update:modelValue', input.value);
};
</script>

<template>
    <div>
        <label class="block text-sm font-medium mb-2">Теги (через запятую)</label>
        <input type="text" :value="inputValue" @input="handleInput" :class="{ 'border-red-500': error }"
            class="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-red-500">
        <p v-if="error" class="text-red-400 text-sm mt-1">{{ error }}</p>
        <div class="mt-2 flex flex-wrap gap-2" v-if="inputValue">
            <span v-for="tag in inputValue.split(',').map(t => t.trim()).filter(t => t.length > 0)" :key="tag"
                class="px-2 py-1 bg-gray-600 rounded-lg text-sm">
                {{ tag }}
            </span>
        </div>
    </div>
</template>