<script setup lang="ts">
import HistoryVideoCard from './HistoryVideoCard.vue';
import type { HistoryItem } from '../types';

defineProps<{
    history: HistoryItem[];
}>();
</script>

<template>
    <div v-if="history && history.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <HistoryVideoCard v-for="(item, index) in history" :key="index" :item="item" />
    </div>
    <div v-else class="text-center p-10 rounded-lg bg-[#1e1e1e]/30">
        <div class="text-gray-400 mb-2">История просмотров пуста</div>
        <p class="text-gray-500 text-sm">Просмотренные видео будут отображаться здесь</p>
    </div>
</template>