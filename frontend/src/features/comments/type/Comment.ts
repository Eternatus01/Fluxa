import { UserId } from '../../user/types/userTypes';

export type CommentId = string;
export type VideoId = string;
export type CommentText = string;

// Пользователь в контексте комментариев
export interface CommentUser {
    id: UserId;
    username: string | null;
    avatar_url?: string | null;
    channel_name?: string;
}

// Основная структура комментария
export interface Comment {
    id: CommentId;
    video_id: VideoId;
    user_id: UserId;
    text: CommentText;
    parent_id?: CommentId | null;
    user?: CommentUser;
    created_at?: string;
    likes_count: number;
    dislikes_count: number;
    replies?: Comment[];
    reply_count?: number;
}

// Общий тип ответа API
export interface ApiResponse<T> {
    data: T;
    message?: string;
    status?: number;
}

// Типизированные ответы API для комментариев
export type CommentResponse = ApiResponse<Comment>;
export type CommentsResponse = ApiResponse<Comment[]>;

// Ошибки
export interface CommentError {
    message: string;
    status?: number;
    field?: string;
    code?: string;
}

// Параметры запросов
export interface AddCommentParams {
    video_id: VideoId;
    user_id: UserId;
    text: CommentText;
    parent_id?: CommentId;
}

export interface DeleteCommentParams {
    comment_id: CommentId;
}

// Состояние хранилища комментариев
export interface CommentsState {
    commentsMap: Record<VideoId, Comment[]>;
    repliesMap: Record<CommentId, Comment[]>;
    isLoading: boolean;
    error: CommentError | null;
}