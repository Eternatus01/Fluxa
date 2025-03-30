import { useSubscriptionApi } from "../composable/useSubscriptionApi";
import { defineStore } from 'pinia';
import { computed, ref, type Ref } from "vue";
import {
    Subscription,
    SubscriptionState,
    SubscriptionError,
    ChannelId,
    SubscriberId
} from "../types/subscriptionTypes";
import { useUserStore } from "../../user/stores/userStore";
import { UserData, UserId } from "../../user/types/userTypes";

export const useSubscriptionStore = defineStore("subscription", () => {
    const subscriptionApi = useSubscriptionApi();
    const userStore = useUserStore();

    // Реактивные состояния
    const subscriptions: Ref<UserData[] | null> = ref([]);
    const userSubscriptions: Ref<UserData[] | null> = ref(null);
    const subscriptionsCache: Ref<Subscription[]> = ref([]);
    const isLoading: Ref<boolean> = ref(false);
    const error: Ref<SubscriptionError | null> = ref(null);

    const fetchUserSubscriptions = async (user_id: UserId): Promise<UserData[] | null | undefined> => {
        isLoading.value = true;
        error.value = null;

        try {
            const data = await subscriptionApi.fetchUserSubscriptions(user_id);
            const usersData = await userStore.getUsersById(data);
            subscriptions.value = usersData;
            return usersData;
        } catch (err) {
            console.error("Ошибка при загрузке подписок пользователя:", err);
            error.value = err as SubscriptionError;
            userSubscriptions.value = null;
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    const checkSubscription = async (target_id: ChannelId): Promise<boolean> => {
        isLoading.value = true;
        error.value = null;

        try {
            const data = await subscriptionApi.checkSubscription(target_id);
            return data;
        } catch (err) {
            console.error("Check subscription error:", err);
            error.value = err as SubscriptionError;
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    const subscribe = async (target_id: ChannelId): Promise<void> => {
        isLoading.value = true;
        error.value = null;

        try {
            await subscriptionApi.subscribe(target_id);
        } catch (err) {
            console.error("Ошибка при подписке:", err);
            error.value = err as SubscriptionError;
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const unsubscribe = async (target_id: ChannelId): Promise<void> => {
        isLoading.value = true;
        error.value = null;

        try {
            await subscriptionApi.unSubscribe(target_id);
        } catch (err) {
            console.error("Ошибка при отписке:", err);
            error.value = err as SubscriptionError;
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const toggleSubscribe = async (target_id: ChannelId): Promise<void> => {
        isLoading.value = true;
        error.value = null;

        try {
            const data = await subscriptionApi.checkSubscription(target_id);
            if (data) {
                await unsubscribe(target_id);
            } else {
                await subscribe(target_id);
            }
        } catch (err) {
            error.value = err as SubscriptionError;
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    const clearSubscriptions = (): void => {
        subscriptions.value = null;
        userSubscriptions.value = null;
        error.value = null;
    };

    return {
        subscriptions: computed(() => subscriptions.value),
        userSubscriptions: computed(() => userSubscriptions.value),
        subscriptionsCache: computed(() => subscriptionsCache.value),
        isLoading: computed(() => isLoading.value),
        error: computed(() => error.value),
        fetchUserSubscriptions,
        checkSubscription,
        toggleSubscribe,
        subscribe,
        unsubscribe,
        clearSubscriptions
    };
});