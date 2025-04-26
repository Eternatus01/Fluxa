import { ref } from 'vue';

// Создаем глобальный кэш для хранения статусов подписок
const subscriptionStatusCache = ref(new Map<string, boolean>());

/**
 * Composable для работы с кэшем статусов подписок
 * Использует глобальный кэш, доступный всем компонентам
 */
export function useSubscriptionCache() {
    /**
     * Получить статус подписки из кэша
     * @param id ID объекта (канала, плейлиста)
     * @returns Статус подписки или undefined, если нет в кэше
     */
    const getSubscriptionStatus = (id: string): boolean | undefined => {
        if (subscriptionStatusCache.value.has(id)) {
            return subscriptionStatusCache.value.get(id);
        }
        return undefined;
    };

    /**
     * Установить статус подписки в кэш
     * @param id ID объекта (канала, плейлиста)
     * @param status Статус подписки (true/false)
     */
    const setSubscriptionStatus = (id: string, status: boolean): void => {
        subscriptionStatusCache.value.set(id, status);
    };

    /**
     * Проверить наличие id в кэше
     * @param id ID объекта
     * @returns true, если id есть в кэше
     */
    const hasSubscriptionStatus = (id: string): boolean => {
        return subscriptionStatusCache.value.has(id);
    };

    /**
     * Удалить статус подписки из кэша
     * @param id ID объекта
     */
    const removeSubscriptionStatus = (id: string): void => {
        subscriptionStatusCache.value.delete(id);
    };

    /**
     * Очистить весь кэш статусов подписок
     */
    const clearSubscriptionCache = (): void => {
        subscriptionStatusCache.value.clear();
    };

    return {
        getSubscriptionStatus,
        setSubscriptionStatus,
        hasSubscriptionStatus,
        removeSubscriptionStatus,
        clearSubscriptionCache
    };
} 