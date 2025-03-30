import { useSubscriptionApi } from "../composable/useSubscriptionApi";
import { defineStore } from 'pinia';
import { computed, ref, type Ref } from "vue";
import type { Subscription } from "../types";
import { useUserStore } from "../../user/stores/userStore";

export const useSubscriptionStore = defineStore("subscription", () => {
    const subscriptionApi = useSubscriptionApi();
    const userStore = useUserStore()

    const subscriptions: Ref<UserData[] | null> = ref([]);
    const userSubscriptions: Ref<UserData[] | null> = ref(null);
    const subscriptionsCache: Ref<Subscription[]> = ref([]);

    const fetchUserSubscriptions = async (user_id: string): Promise<UserData[] | null | undefined> => {
        try {
            const data = await subscriptionApi.fetchUserSubscriptions(user_id);
            const usersData = await userStore.getUsersById(data)
            subscriptions.value = usersData;
            return usersData;
        } catch (error) {
            console.error("Ошибка при загрузке подписок пользователя:", error);
            userSubscriptions.value = null;
        }
    };

    const checkSubscription = async (target_id: string): Promise<Boolean> => {
        try {
            const data = await subscriptionApi.checkSubscription(target_id);

            return data
        } catch (error) {
            console.error("Check subscription error:", error);
            return false;
        }
    };

    const subscribe = async (target_id: string): Promise<void> => {
        try {
            await subscriptionApi.subscribe(target_id);
        } catch (error) {
            console.error("Ошибка при подписке:", error);
            throw error;
        }
    };

    const unsubscribe = async (target_id: string): Promise<void> => {
        try {
            await subscriptionApi.unSubscribe(target_id);
        } catch (error) {
            console.error("Ошибка при отписке:", error);
            throw error;
        }
    };

    const toggleSubscribe = async (target_id: string): Promise<void> => {
        const data = await subscriptionApi.checkSubscription(target_id);
        if (data) {
            await unsubscribe(target_id);
        } else {
            await subscribe(target_id);
        }
    }

    const clearSubscriptions = () => {
        subscriptions.value = null;
        userSubscriptions.value = null;
    };

    return {
        subscriptions: computed(() => subscriptions.value),
        userSubscriptions: computed(() => userSubscriptions.value),
        subscriptionsCache: computed(() => subscriptionsCache.value),
        fetchUserSubscriptions,
        checkSubscription,
        toggleSubscribe,
        subscribe,
        unsubscribe,
        clearSubscriptions
    };
});