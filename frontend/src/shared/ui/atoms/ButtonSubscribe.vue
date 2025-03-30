<template>
    <button @click="toggleSubscription" class="subscribe-button" :class="{ 'subscribed': isSubscribed }"
        v-if="userStore.user_id !== id">
        <span class="button-text">{{ isSubscribed ? 'Отписаться' : 'Подписаться' }}</span>
    </button>
</template>

<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import { useSubscriptionStore } from '../../../features/subscription/stores/subscription';
import { useUserStore } from './../../../features/user/stores/userStore';

const userStore = useUserStore();
const subscriptionStore = useSubscriptionStore();

const props = defineProps<{
    id: string;
}>();

const isSubscribed: Ref<Boolean> = ref(false);

const toggleSubscription = async () => {
    isSubscribed.value = !isSubscribed.value
    await subscriptionStore.toggleSubscribe(props.id);
};

onMounted(async () => userStore.user_id !== props.id ? isSubscribed.value = await subscriptionStore.checkSubscription(props.id) : null);
</script>

<style scoped>
.subscribe-button {
    padding: 0.625rem 1.25rem;
    border-radius: 9999px;
    font-weight: 600;
    letter-spacing: 0.01em;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #3b82f6;
    color: white;
    font-size: 0.9375rem;
    transform: translateY(0);
}

.subscribe-button:hover {
    background-color: #2563eb;
    transform: translateY(-2px);
}

.subscribe-button:active {
    transform: translateY(0);
}

.subscribe-button.subscribed {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
}

.subscribe-button.subscribed:hover {
    background-color: rgba(255, 255, 255, 0.3);
}

.button-text {
    position: relative;
    z-index: 10;
}
</style>