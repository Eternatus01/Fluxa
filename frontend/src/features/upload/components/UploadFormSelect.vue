<script setup lang="ts">
defineProps<{
    modelValue: string;
}>();

const videoTypes = [
    { value: 'public', label: 'Публичное', hint: 'Видео будет доступно всем пользователям' },
    { value: 'private', label: 'Приватное', hint: 'Видео будет доступно только вам' },
    { value: 'link', label: 'Доступ по ссылке', hint: 'Видео будет доступно только по прямой ссылке' }
];
</script>

<template>
    <div>
        <label class="block text-sm font-medium mb-2 text-gray-200">Тип видео</label>
        <select :value="modelValue" @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
            class="w-full p-3 bg-[#252525] rounded-lg text-white border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
            <option v-for="type in videoTypes" :key="type.value" :value="type.value">
                {{ type.label }}
            </option>
        </select>
        <p class="text-xs text-gray-400 mt-1">
            {{videoTypes.find(type => type.value === modelValue)?.hint}}
        </p>
    </div>
</template>