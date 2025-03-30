import { apiClient } from './../../../widgets/apiClient';
import { useVideoApi } from './useVideoApi';

interface ErrorMessage {
    message?: string;
}

export const useUploadApi = () => {
    const videoApi = useVideoApi();

    const uploadVideo = async (
        videoFile: File,
        thumbnailFile: File,
        user_id: string,
        title: string,
        description: string,
        tags: string[],
        videoType: string
    ): Promise<any> => {
        try {
            // Создаем FormData для загрузки файлов
            const storageFormData = new FormData();
            storageFormData.append('video', videoFile);
            storageFormData.append('thumbnail', thumbnailFile);
            storageFormData.append('videoPath', `${user_id}/${videoFile.name}`);
            storageFormData.append('thumbnailPath', `${user_id}/${thumbnailFile.name}`);
            // Первый запрос: Загрузка файлов в хранилище
            const storageResponse = await apiClient(
                '/api/storage/video',
                {
                    method: 'POST',
                    data: storageFormData,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (storageResponse.error) {
                console.error('Ошибка при загрузке файлов:', storageResponse.error);
                throw new Error(storageResponse.error.message || 'Ошибка при загрузке файлов');
            }

            console.log('Файлы успешно загружены:', storageResponse.data);

            // Второй запрос: Создание записи в БД
            const videoUrl = `https://zldqqthnfodtqdcfezap.supabase.co/storage/v1/object/public/Videos/${user_id}/${videoFile.name}`;
            const thumbnailUrl = `https://zldqqthnfodtqdcfezap.supabase.co/storage/v1/object/public/Thumbnails/${user_id}/${thumbnailFile.name}`;

            const videoResponse = await apiClient(
                '/api/video/upload',
                {
                    method: 'POST',
                    data: {
                        user_id,
                        title,
                        description,
                        videoUrl,
                        thumbnailUrl,
                        tags,
                        videoType
                    }
                }
            );

            if (videoResponse.error) {
                console.error('Ошибка при создании записи видео:', videoResponse.error);
                throw new Error(videoResponse.error.message || 'Ошибка при создании записи видео');
            }

            // Инвалидируем кэш после успешной загрузки видео
            videoApi.invalidateVideoCache('all', user_id);

            return videoResponse.data;
        } catch (error) {
            console.error('Ошибка при загрузке видео:', error);
            const err = error as ErrorMessage;
            throw new Error(err?.message || 'Произошла ошибка при выполнении запроса');
        }
    };

    return { uploadVideo };
};