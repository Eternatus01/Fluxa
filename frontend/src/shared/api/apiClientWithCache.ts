import { apiClient } from '../../widgets/apiClient';

interface CacheOptions {
    enabled?: boolean;
    ttl?: number;
    persistent?: boolean;
    key?: string;
}

interface CacheItem<T> {
    data: T;
    timestamp: number;
}

// Функция для генерации ключа кэша
const generateCacheKey = (url: string, config: any, customKey?: string): string => {
    if (customKey) {
        return `app_cache:${customKey}`;
    }

    const method = config.method || 'GET';
    const params = config.params ? JSON.stringify(config.params) : '';
    return `app_cache:${method}:${url}:${params}`;
};

// Функция для сохранения данных в кэш
const saveToCache = <T>(key: string, data: T, ttl: number, persistent: boolean): void => {
    const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now() + ttl,
    };

    try {
        if (persistent) {
            localStorage.setItem(key, JSON.stringify(cacheItem));
        } else {
            sessionStorage.setItem(key, JSON.stringify(cacheItem));
        }
        console.log(`Данные сохранены в кэш: ${key}`);
    } catch (error) {
        console.error(`Ошибка при сохранении в кэш: ${key}`, error);
    }
};

// Функция для получения данных из кэша
const getFromCache = <T>(key: string, persistent: boolean): T | null => {
    try {
        const storage = persistent ? localStorage : sessionStorage;
        const cachedData = storage.getItem(key);

        if (!cachedData) {
            return null;
        }

        const cacheItem: CacheItem<T> = JSON.parse(cachedData);

        // Проверяем, не истек ли срок действия кэша
        if (cacheItem.timestamp < Date.now()) {
            console.log(`Кэш устарел: ${key}`);
            storage.removeItem(key);
            return null;
        }

        console.log(`Данные получены из кэша: ${key}`);
        return cacheItem.data;
    } catch (error) {
        console.error(`Ошибка при получении из кэша: ${key}`, error);
        return null;
    }
};

// Функция для инвалидации кэша
export const invalidateApiCache = (url: string, config: any, customKey?: string): void => {
    // Если передан пользовательский ключ или префикс, используем его
    if (customKey) {
        // Если ключ заканчивается на '*', это префикс
        if (customKey.endsWith('*')) {
            const prefix = customKey.slice(0, -1); // Убираем *
            console.log(`Инвалидация кэша по префиксу: ${prefix}`);

            // Проверяем localStorage
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(`app_cache:${prefix}`)) {
                    console.log(`Инвалидация кэша: ${key}`);
                    localStorage.removeItem(key);
                }
            }

            // Проверяем sessionStorage
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key && key.startsWith(`app_cache:${prefix}`)) {
                    console.log(`Инвалидация кэша: ${key}`);
                    sessionStorage.removeItem(key);
                }
            }

            return;
        }

        // Обычный ключ
        const cacheKey = `app_cache:${customKey}`;
        console.log(`Инвалидация кэша: ${cacheKey}`);

        try {
            localStorage.removeItem(cacheKey);
            sessionStorage.removeItem(cacheKey);
        } catch (error) {
            console.error(`Ошибка при инвалидации кэша: ${cacheKey}`, error);
        }

        return;
    }

    // Стандартный вариант с генерацией ключа по URL
    const cacheKey = generateCacheKey(url, config);
    console.log(`Инвалидация кэша: ${cacheKey}`);

    try {
        localStorage.removeItem(cacheKey);
        sessionStorage.removeItem(cacheKey);
    } catch (error) {
        console.error(`Ошибка при инвалидации кэша: ${cacheKey}`, error);
    }
};

// Функция для полной очистки всего кеша
export const clearAllApiCache = (): void => {
    console.log('Полная очистка всего API кеша');

    try {
        // Очищаем все записи с префиксом app_cache
        const storagesToClear = [localStorage, sessionStorage];

        storagesToClear.forEach(storage => {
            const keysToRemove: string[] = [];

            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                if (key && key.startsWith('app_cache:')) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach(key => {
                storage.removeItem(key);
                console.log(`Удален кэш: ${key}`);
            });
        });
    } catch (error) {
        console.error('Ошибка при полной очистке кеша:', error);
    }
};

// Добавляем токен авторизации к запросам, если он доступен
const addAuthToken = (config: any): any => {
    const token = localStorage.getItem('auth_token');

    if (token) {
        return {
            ...config,
            headers: {
                ...config.headers,
                'Authorization': `Bearer ${token}`
            }
        };
    }

    return config;
};

// Основная функция для работы с API и кэшем
export const apiClientWithCache = async <T>(
    url: string,
    config: any = {},
    cacheOptions: CacheOptions = {}
): Promise<T> => {
    // Настройки кэша по умолчанию
    const {
        enabled = true,
        ttl = 5 * 60 * 1000, // 5 минут по умолчанию
        persistent = false,
        key: customKey,
    } = cacheOptions;

    const cacheKey = generateCacheKey(url, config, customKey);

    // Если кэширование включено, пытаемся получить данные из кэша
    if (enabled && config.method === 'GET') {
        const cachedData = getFromCache<T>(cacheKey, persistent);
        if (cachedData) {
            return cachedData;
        }
    }

    // Добавляем токен авторизации к запросам
    const configWithAuth = addAuthToken(config);

    // Если данных в кэше нет или кэширование отключено, делаем запрос к API
    try {
        const response = await apiClient(url, configWithAuth);

        // Если это GET-запрос и кэширование включено, сохраняем данные в кэш
        if (enabled && config.method === 'GET') {
            saveToCache(cacheKey, response, ttl, persistent);
        }

        return response as T;
    } catch (error) {
        console.error(`Ошибка при выполнении запроса: ${url}`, error);
        throw error;
    }
};

/**
 * Инвалидировать все кэши, связанные с указанным URL
 * @param urlPrefix - Префикс URL
 * @param removePersistent - Удалить ли данные из постоянного хранилища
 */
export const invalidateApiCacheByUrlPrefix = (
    urlPrefix: string,
    removePersistent: boolean = true
): void => {
    // Получаем все ключи кэша
    const storagesToCheck = [localStorage, sessionStorage];

    storagesToCheck.forEach(storage => {
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (key && key.startsWith(`app_cache:${urlPrefix}`)) {
                storage.removeItem(key);
                console.log(`Инвалидирован кэш: ${key}`);
            }
        }
    });
};

// Функция для очистки всего кэша
export const clearAllCache = (): void => {
    // Очищаем все записи с префиксом app_cache
    const storagesToClear = [localStorage, sessionStorage];

    storagesToClear.forEach(storage => {
        const keysToRemove: string[] = [];

        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (key && key.startsWith('app_cache:')) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => {
            storage.removeItem(key);
            console.log(`Удален кэш: ${key}`);
        });
    });
};

// Функция для очистки абсолютно всего хранилища
export const clearAllStorage = (): void => {
    console.log('Полная очистка всего localStorage и sessionStorage');

    try {
        // Сохраним токен авторизации
        const authToken = localStorage.getItem('auth_token');

        // Очищаем всё хранилище
        localStorage.clear();
        sessionStorage.clear();

        // Восстанавливаем токен авторизации
        if (authToken) {
            localStorage.setItem('auth_token', authToken);
        }

        console.log('Хранилище полностью очищено');
    } catch (error) {
        console.error('Ошибка при полной очистке хранилища:', error);
    }
};