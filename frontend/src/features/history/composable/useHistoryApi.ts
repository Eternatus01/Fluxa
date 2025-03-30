import { apiClient } from './../../../widgets/apiClient';
import { useApiWithCache } from '../../../shared/composables/useApiWithCache';

interface ErrorMessage {
    message?: string;
}

export const useHistoryApi = () => {
    // Создаем экземпляр API с кэшированием для истории
    const api = useApiWithCache('history', {
        baseUrl: 'http://localhost:3001',
        defaultCacheOptions: {
            enabled: false, // Отключаем кэширование по умолчанию
            ttl: 0,
            persistent: false
        }
    });

    const fetchHistory = async (user_id: string): Promise<any[]> => {
        try {
            const data = await apiClient('/api/history', {
                method: 'GET',
                params: { user_id },
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            return data;
        } catch (error) {
            const err = error as ErrorMessage;
            throw new Error(err?.message || 'Не удалось загрузить историю');
        }
    };

    return { 
        fetchHistory
    };
};