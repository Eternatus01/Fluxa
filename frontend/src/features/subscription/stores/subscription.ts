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
import { useUiStore } from '@/shared/stores/uiStore';
import { useSubscriptionCache } from '@/shared/composables/useSubscriptionCache';

export const useSubscriptionStore = defineStore("subscription", () => {
    const subscriptionApi = useSubscriptionApi();
    const userStore = useUserStore();
    const uiStore = useUiStore();
    const subscriptionCache = useSubscriptionCache();

    // Реактивные состояния
    const subscriptions: Ref<UserData[] | null> = ref([]);
    const userSubscriptions: Ref<UserData[] | null> = ref(null);
    const subscriptionsCache: Ref<Subscription[]> = ref([]);
    const error: Ref<SubscriptionError | null> = ref(null);

    const fetchUserSubscriptions = async (user_id: UserId): Promise<UserData[] | null | undefined> => {
        uiStore.isLoading = true;
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
            uiStore.isLoading = false;
        }
    };

    const checkSubscription = async (target_id: ChannelId): Promise<boolean> => {
        // Сначала проверяем кэш
        if (subscriptionCache.hasSubscriptionStatus(target_id)) {
            return subscriptionCache.getSubscriptionStatus(target_id) || false;
        }

        uiStore.isLoading = true;
        error.value = null;

        try {
            const status = await subscriptionApi.checkSubscription(target_id);
            // Сохраняем результат в кэш
            subscriptionCache.setSubscriptionStatus(target_id, status);
            return status;
        } catch (err) {
            console.error("Check subscription error:", err);
            error.value = err as SubscriptionError;
            return false;
        } finally {
            uiStore.isLoading = false;
        }
    };

    const subscribe = async (target_id: ChannelId): Promise<void> => {
        uiStore.isLoading = true;
        error.value = null;

        try {
            await subscriptionApi.subscribe(target_id);
            // Обновляем кэш после успешной подписки
            subscriptionCache.setSubscriptionStatus(target_id, true);
        } catch (err) {
            console.error("Ошибка при подписке:", err);
            error.value = err as SubscriptionError;
            throw err;
        } finally {
            uiStore.isLoading = false;
        }
    };

    const unsubscribe = async (target_id: ChannelId): Promise<void> => {
        uiStore.isLoading = true;
        error.value = null;

        try {
            await subscriptionApi.unSubscribe(target_id);
            // Обновляем кэш после успешной отписки
            subscriptionCache.setSubscriptionStatus(target_id, false);
        } catch (err) {
            console.error("Ошибка при отписке:", err);
            error.value = err as SubscriptionError;
            throw err;
        } finally {
            uiStore.isLoading = false;
        }
    };

    const toggleSubscribe = async (target_id: ChannelId): Promise<void> => {
        uiStore.isLoading = true;
        error.value = null;

        try {
            // Проверяем статус подписки (используем кэш, если доступен)
            const currentStatus = subscriptionCache.hasSubscriptionStatus(target_id)
                ? subscriptionCache.getSubscriptionStatus(target_id)
                : await subscriptionApi.checkSubscription(target_id);

            if (currentStatus) {
                // Если подписка есть - отписываемся
                await subscriptionApi.unSubscribe(target_id);
                subscriptionCache.setSubscriptionStatus(target_id, false);
            } else {
                // Если подписки нет - подписываемся
                await subscriptionApi.subscribe(target_id);
                subscriptionCache.setSubscriptionStatus(target_id, true);
            }
        } catch (err) {
            error.value = err as SubscriptionError;
            throw err;
        } finally {
            uiStore.isLoading = false;
        }
    };

    const clearSubscriptions = (): void => {
        subscriptions.value = null;
        userSubscriptions.value = null;
        error.value = null;
        // Очищаем кэш при выходе из аккаунта
        subscriptionCache.clearSubscriptionCache();
    };

    return {
        subscriptions: computed(() => subscriptions.value),
        userSubscriptions: computed(() => userSubscriptions.value),
        subscriptionsCache: computed(() => subscriptionsCache.value),
        error: computed(() => error.value),
        fetchUserSubscriptions,
        checkSubscription,
        toggleSubscribe,
        subscribe,
        unsubscribe,
        clearSubscriptions
    };
});