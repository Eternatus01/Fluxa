<script setup lang="ts">
import HistoryVideoCard from './HistoryVideoCard.vue';
import type { HistoryItem } from '../types';

defineProps<{
    history: HistoryItem[];
}>();
</script>

<template>
    <div v-if="history && history.length > 0" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <HistoryVideoCard v-for="(item, index) in history" :key="index" :item="item" />
    </div>
    <div v-else class="text-center text-gray-500 py-12">
        <p>История просмотров пуста.</p>
    </div>
</template>