<script setup lang="ts">
import { UserData } from '../../user/types/userTypes';
import SubscriptionCard from './SubscriptionCard.vue';
import { computed } from 'vue';

const props = defineProps<{
    subscriptions: UserData[] | null;
}>();

// Вычисляемое свойство для отслеживания наличия подписок
const hasSubscriptions = computed(() => {
    return props.subscriptions && props.subscriptions.length > 0;
});
</script>

<template>
    <div v-if="hasSubscriptions" class="grid grid-cols-1 gap-4">
        <SubscriptionCard v-for="subscription in subscriptions" :key="subscription.id" :subscription="subscription" />
    </div>
    <div v-else class="text-center py-8">
        <p class="text-gray-400">У вас пока нет подписок</p>
    </div>
</template>