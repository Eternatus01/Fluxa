<script setup lang="ts">
import { UserData } from '../../user/types/userTypes';
import { useSubscriptionStore } from '../stores/subscription';
import { useUserStore } from '../../user/stores/userStore';
import { ref, computed } from 'vue';

const props = defineProps<{
    subscription: UserData;
}>();

const subscriptionStore = useSubscriptionStore();
const userStore = useUserStore();
const isUnsubscribing = ref(false);

// Безопасное получение URL баннера
const bannerUrl = computed(() => props.subscription.bunner_url || '/default-banner.jpg');

const unsubscribe = async () => {
    if (!isUnsubscribing.value && props.subscription.id) {
        isUnsubscribing.value = true;
        try {
            await subscriptionStore.unsubscribe(props.subscription.id);
            // Обновляем список подписок после отписки
            if (userStore.user_id) {
                await subscriptionStore.fetchUserSubscriptions(userStore.user_id);
            }
        } catch (error) {
            console.error('Ошибка при отписке:', error);
        } finally {
            isUnsubscribing.value = false;
        }
    }
};
</script>

<template>
    <div class="bg-[#1e1e1e] group rounded-lg overflow-hidden transform hover:translate-y-[-5px] transition-all duration-300">
        <div class="relative">
            <div class="aspect-video">
                <img :src="bannerUrl" alt="Channel Banner" class="w-full h-full object-cover">
            </div>
            <div
                class="absolute bottom-0 left-5 transform translate-y-1/2 rounded-full overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition-all duration-300">
                <router-link :to="{ name: 'Channel', params: { username: subscription.username } }">
                    <img :src="subscription.avatar_url || '/default-avatar.jpg'"
                        class="w-20 h-20 object-cover transition-transform duration-300 hover:scale-110"
                        alt="Channel Avatar">
                </router-link>
            </div>
        </div>

        <div class="pt-12 pb-5 px-5">
            <div class="flex justify-between items-start">
                <div>
                    <router-link :to="{ name: 'Channel', params: { username: subscription.username } }"
                        class="text-white text-lg font-medium hover:text-blue-500 transition-colors duration-200">
                        {{ subscription.channel_name }}
                    </router-link>
                    <div class="flex items-center mt-1.5">
                        <span class="text-gray-400">@{{ subscription.username }}</span>
                    </div>
                </div>
                <button @click="unsubscribe" :disabled="isUnsubscribing"
                    class="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-base font-medium rounded-md transition-all duration-200 flex items-center">
                    <svg v-if="isUnsubscribing" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    <span>{{ isUnsubscribing ? 'Отписываюсь...' : 'Отписаться' }}</span>
                </button>
            </div>

            <div class="flex items-center mt-3 text-gray-400">
                <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1.5" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                            d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <span>{{ subscription.subscribers_count }} подписчиков</span>
                </div>
            </div>
        </div>
    </div>
</template>