<script setup lang="ts">
const props = defineProps<{
    modelValue: string;
    error?: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    emit('update:modelValue', input.value);
};
</script>

<template>
    <div>
        <label class="block text-sm font-medium mb-2">Теги (через запятую)</label>
        <input type="text" :value="modelValue" @input="handleInput" :class="{ 'border-red-500': error }"
            class="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-red-500">
        <p v-if="error" class="text-red-400 text-sm mt-1">{{ error }}</p>
    </div>
</template>