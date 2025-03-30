<template>
    <button @click="toggleSubscription" :class="[
        'px-4 py-2 rounded-full transition-colors duration-300 cursor-pointer',
        isSubscribed ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-700 hover:bg-red-600',
    ]" v-if="userStore.user_id !== id">
        {{ isSubscribed ? 'Отписаться' : 'Подписаться' }}
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