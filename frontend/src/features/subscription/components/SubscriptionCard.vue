<script setup lang="ts">
import { UserData } from '../../user/types/userTypes';
import { useSubscriptionStore } from '../stores/subscription';
import { useUserStore } from '../../user/stores/userStore';

const props = defineProps<{
    subscription: UserData;
}>();

const subscriptionStore = useSubscriptionStore();
const userStore = useUserStore();

const unsubscribe = async () => {
    if (props.subscription.id) {
        await subscriptionStore.unsubscribe(props.subscription.id);
        // Обновляем список подписок после отписки
        if (userStore.user_id) {
            await subscriptionStore.fetchUserSubscriptions(userStore.user_id);
        }
    }
};
</script>

<template>
    <div class="flex flex-col gap-4 bg-gray-900 p-4 rounded-lg">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <router-link :to="{ name: 'Channel', params: { username: subscription.username } }">
                    <img :src="subscription.avatar_url || ''" class="w-12 h-12 rounded-full object-cover"
                        alt="Channel Avatar">
                </router-link>
                <div>
                    <h3 class="text-lg font-semibold">{{ subscription.channel_name }}</h3>
                    <p class="text-gray-400 text-sm">{{ subscription.subscribers_count }} подписчиков</p>
                </div>
            </div>
            <button @click="unsubscribe"
                class="px-4 py-2 rounded-full transition-colors duration-300 cursor-pointer bg-gray-600 hover:bg-gray-500">
                Отписаться
            </button>
        </div>
    </div>
</template>