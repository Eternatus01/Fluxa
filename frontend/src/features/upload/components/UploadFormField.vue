<script setup lang="ts">
defineProps<{
    label: string;
    type?: string;
    modelValue: string;
    placeholder?: string;
    rows?: number;
    hint?: string;
}>();
</script>

<template>
    <div>
        <label class="block text-sm font-medium mb-2 text-gray-200">{{ label }}</label>
        <component :is="type === 'textarea' ? 'textarea' : 'input'" :type="type || 'text'" :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" :placeholder="placeholder"
            :rows="rows"
            class="w-full p-3 bg-[#252525] rounded-lg text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
        <p v-if="hint" class="text-xs text-gray-400 mt-1">{{ hint }}</p>
    </div>
</template>