import { apiClient } from "./../../../widgets/apiClient";
import {
    Subscription,
    SubscriptionId,
    ChannelId,
    SubscriberId,
    SubscriptionError,
    SubscriptionCheckResponse
} from "../types/subscriptionTypes";
import { UserId } from "../../user/types/userTypes";

interface ErrorMessage {
    message?: string;
    status?: number;
    field?: string;
    code?: string;
}

export const useSubscriptionApi = () => {
    const subscribe = async (target_id: ChannelId): Promise<Subscription> => {
        try {
            const data = await apiClient<Subscription>("/api/subscription/subscribe", {
                method: "POST",
                data: { target_id }
            });
            return data;
        } catch (error) {
            const err = error as ErrorMessage;
            const subscriptionError: SubscriptionError = {
                message: err?.message || 'Не удалось подписаться на канал',
                status: err?.status || 500,
                field: err?.field,
                code: err?.code
            };
            throw subscriptionError;
        }
    };

    const unSubscribe = async (target_id: ChannelId): Promise<void> => {
        try {
            await apiClient<void>("/api/subscription/unsubscribe", {
                method: "DELETE",
                data: { target_id }
            });
        } catch (error) {
            const err = error as ErrorMessage;
            const subscriptionError: SubscriptionError = {
                message: err?.message || 'Не удалось отписаться от канала',
                status: err?.status || 500,
                field: err?.field,
                code: err?.code
            };
            throw subscriptionError;
        }
    };

    const checkSubscription = async (target_id: ChannelId): Promise<boolean> => {
        try {
            const data = await apiClient<SubscriptionCheckResponse>("/api/subscription/check", {
                method: "GET",
                params: { target_id }
            });
            return data?.isSubscribed;
        } catch (error) {
            const err = error as ErrorMessage;
            const subscriptionError: SubscriptionError = {
                message: err?.message || 'Не удалось проверить статус подписки',
                status: err?.status || 500,
                field: err?.field,
                code: err?.code
            };
            throw subscriptionError;
        }
    };

    const fetchUserSubscriptions = async (user_id: UserId): Promise<ChannelId[]> => {
        try {
            const data = await apiClient<ChannelId[]>(`/api/subscription/get`, {
                method: "GET",
                params: { user_id }
            });
            return data;
        } catch (error) {
            const err = error as ErrorMessage;
            const subscriptionError: SubscriptionError = {
                message: err?.message || 'Не удалось получить список подписок пользователя',
                status: err?.status || 500,
                field: err?.field,
                code: err?.code
            };
            throw subscriptionError;
        }
    };

    return {
        subscribe,
        unSubscribe,
        checkSubscription,
        fetchUserSubscriptions
    };
};