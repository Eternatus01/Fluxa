import { apiClient } from "./../../../widgets/apiClient";
import type { Subscription } from "../types";

export const useSubscriptionApi = () => {
    const subscribe = async (target_id: string): Promise<Subscription> => {
        const data = await apiClient("/api/subscription/subscribe", {
            method: "POST",
            data: { target_id }
        });
        return data;
    };

    const unSubscribe = async (target_id: string): Promise<void> => {
        await apiClient("/api/subscription/unsubscribe", {
            method: "DELETE",
            data: { target_id }
        });
    };

    const checkSubscription = async (target_id: string): Promise<Boolean> => {
        const data = await apiClient("/api/subscription/check", {
            method: "GET",
            params: { target_id }
        });
        return data?.isSubscribed;
    };

    const fetchUserSubscriptions = async (user_id: string): Promise<string[]> => {
        const data  = await apiClient(`/api/subscription/get`, {
            method: "GET",
            params: { user_id }
        });
        return data;
    };

    return {
        subscribe,
        unSubscribe,
        checkSubscription,
        fetchUserSubscriptions
    };
};