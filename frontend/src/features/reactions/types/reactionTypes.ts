import { UserId } from '../../user/types/userTypes';

// Идентификаторы
export type ReactionId = string;
export type VideoId = string;
export type CommentId = string;

// Типы реакций
export type ReactionType = 'like' | 'dislike' | 'love' | 'laugh' | 'sad' | 'angry';

// Базовый интерфейс реакции
export interface Reaction {
    id: ReactionId;
    user_id: UserId;
    type: ReactionType;
    created_at?: string;
    updated_at?: string;
}

// Реакция на видео
export interface VideoReaction extends Reaction {
    video_id: VideoId;
}

// Реакция на комментарий
export interface CommentReaction extends Reaction {
    comment_id: CommentId;
}

// Обобщенная структура для агрегации данных о реакциях
export interface ReactionData {
    likes: number;
    dislikes: number;
    likes_count?: number;
    dislikes_count?: number;
    user_reaction?: ReactionType | null;
    reactions?: Record<ReactionType, number>;
}

// Ответы API
export interface ApiResponse<T> {
    data: T;
    message?: string;
    status?: number;
}

// Параметры запросов
export interface AddVideoReactionParams {
    video_id: VideoId;
    user_id: UserId;
    type: ReactionType;
}

export interface AddCommentReactionParams {
    comment_id: CommentId;
    user_id: UserId;
    type: ReactionType;
}

export interface GetVideoReactionsParams {
    video_id: VideoId;
}

export interface GetCommentReactionsParams {
    comment_id: CommentId;
}

// Ошибки
export interface ReactionError {
    message: string;
    status?: number;
    code?: string;
    field?: string;
}

// Состояние хранилища реакций
export interface ReactionState {
    videoReactions: Record<VideoId, ReactionData>;
    commentReactions: Record<CommentId, ReactionData>;
    isLoading: boolean;
    error: ReactionError | null;
} 