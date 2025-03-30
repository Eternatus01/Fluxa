<script setup lang="ts">
import type { Subscription } from '../types';
import SubscriptionCard from './SubscriptionCard.vue';

defineProps<{
    subscriptions: Subscription[];
}>();
</script>

<template>
    <div v-if="subscriptions.length > 0" class="grid grid-cols-1 gap-4">
        <SubscriptionCard v-for="subscription in subscriptions" :key="subscription.id" :subscription="subscription" />
    </div>
    <div v-else class="text-center py-8">
        <p class="text-gray-400">У вас пока нет подписок</p>
    </div>
</template>