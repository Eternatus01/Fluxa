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
        <label class="block text-sm font-medium mb-2 text-gray-200">Теги (через запятую)</label>
        <input type="text" :value="inputValue" @input="handleInput"
            class="w-full p-3 bg-[#252525] rounded-lg border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
            :class="{ 'border-red-500 focus:ring-red-500': error }" placeholder="gaming, tutorial, vlog">
        <p v-if="error" class="text-red-400 text-sm mt-1">{{ error }}</p>
        <p class="text-xs text-gray-400 mt-1">Разделяйте теги запятыми. Максимум 15 тегов.</p>

        <div class="mt-3 flex flex-wrap gap-2" v-if="inputValue">
            <span v-for="tag in inputValue.split(',').map(t => t.trim()).filter(t => t.length > 0)" :key="tag"
                class="px-3 py-1 bg-[#252525] rounded-full text-xs text-blue-400">
                #{{ tag }}
            </span>
        </div>
    </div>
</template>