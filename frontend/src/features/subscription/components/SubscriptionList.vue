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
    <div v-if="hasSubscriptions" class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
        <SubscriptionCard v-for="(subscription, index) in subscriptions" :key="subscription.id"
            :subscription="subscription" :style="{ 'animation-delay': `${index * 0.05}s` }" class="subscription-card" />
    </div>
    <div v-else class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-16 h-16 mb-4 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.5" class="w-full h-full">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
        </div>
        <p class="text-gray-400 text-lg">У вас пока нет подписок</p>
    </div>
</template>

<style scoped>
.subscription-card {
    opacity: 0;
    animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>