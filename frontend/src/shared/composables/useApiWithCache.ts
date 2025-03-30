import { apiClientWithCache, invalidateApiCache, clearAllApiCache, clearAllStorage } from '../api/apiClientWithCache';
import { ref } from 'vue';

interface ApiOptions {
    baseUrl: string;
    defaultCacheOptions?: {
        enabled?: boolean;
        ttl?: number;
        persistent?: boolean;
    };
}

interface CacheOptions {
    enabled?: boolean;
    ttl?: number;
    persistent?: boolean;
    key?: string;
    forceRefresh?: boolean;
}

export const useApiWithCache = (namespace: string, options: ApiOptions) => {
    const baseUrl = options.baseUrl;
    const defaultCacheOptions = options.defaultCacheOptions || {};

    const get = async <T>(
        endpoint: string,
        params: Record<string, any> = {},
        cacheOptions: CacheOptions = {}
    ) => {
        const url = `${baseUrl}${endpoint}`;

        const mergedCacheOptions = {
            ...defaultCacheOptions,
            ...cacheOptions,
        };

        if (mergedCacheOptions.forceRefresh) {
            mergedCacheOptions.enabled = false;
            console.log(`[${namespace}] Принудительное обновление данных для ${endpoint}`);
        }

        try {
            const response = await apiClientWithCache<T>(url, {
                method: 'GET',
                params,
            }, mergedCacheOptions);

            return { data: ref(response) };
        } catch (error) {
            console.error(`[${namespace}] Ошибка GET запроса: ${url}`, error);
            throw error;
        }
    };

    const post = async <T>(
        endpoint: string,
        data: any,
        invalidateEndpoints: string[] = []
    ) => {
        const url = `${baseUrl}${endpoint}`;

        try {
            const response = await apiClientWithCache<T>(url, {
                method: 'POST',
                data,
            });

            // Инвалидируем кэш для указанных эндпоинтов
            invalidateEndpoints.forEach(endpoint => {
                invalidateApiCache(`${baseUrl}${endpoint}`, { method: 'GET' });
            });

            return { data: ref(response) };
        } catch (error) {
            console.error(`[${namespace}] Ошибка POST запроса: ${url}`, error);
            throw error;
        }
    };

    const put = async <T>(
        endpoint: string,
        data: any,
        invalidateEndpoints: string[] = []
    ) => {
        const url = `${baseUrl}${endpoint}`;

        try {
            const response = await apiClientWithCache<T>(url, {
                method: 'PUT',
                data,
            });

            // Инвалидируем кэш для указанных эндпоинтов
            invalidateEndpoints.forEach(endpoint => {
                invalidateApiCache(`${baseUrl}${endpoint}`, { method: 'GET' });
            });

            return { data: ref(response) };
        } catch (error) {
            console.error(`[${namespace}] Ошибка PUT запроса: ${url}`, error);
            throw error;
        }
    };

    const del = async <T>(
        endpoint: string,
        data: any = {},
        invalidateEndpoints: string[] = []
    ) => {
        const url = `${baseUrl}${endpoint}`;

        try {
            const response = await apiClientWithCache<T>(url, {
                method: 'DELETE',
                data,
            });

            // Инвалидируем кэш для указанных эндпоинтов
            invalidateEndpoints.forEach(endpoint => {
                invalidateApiCache(`${baseUrl}${endpoint}`, { method: 'GET' });
            });

            return { data: ref(response) };
        } catch (error) {
            console.error(`[${namespace}] Ошибка DELETE запроса: ${url}`, error);
            throw error;
        }
    };

    const invalidateCache = (endpoint: string) => {
        const url = `${baseUrl}${endpoint}`;
        invalidateApiCache(url, { method: 'GET' });
    };

    const clearAllCache = () => {
        console.log(`[${namespace}] Полная очистка всего кеша API`);
        clearAllApiCache();
    };

    const clearEverything = () => {
        console.log(`[${namespace}] Очистка всего хранилища`);
        clearAllStorage();
    };

    const saveToCache = <T>(
        key: string,
        data: T,
        ttl: number = defaultCacheOptions.ttl || 5 * 60 * 1000,
        persistent: boolean = !!defaultCacheOptions.persistent,
        forceUpdate: boolean = true
    ) => {
        if (forceUpdate) {
            // Сначала инвалидируем ключ, чтобы гарантировать обновление
            invalidateCache(key);
        }

        console.log(`Сохранение данных в кэш: ${key}`, data);
    };

    return {
        get,
        post,
        put,
        del,
        invalidateCache,
        clearAllCache,
        clearEverything,
        saveToCache
    };
};