import { Request } from 'express';

// Интерфейс для кастомных ошибок
export interface AppError extends Error {
    statusCode?: number;
    details?: any;
}

// Расширенный Request с пользовательскими данными
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email?: string;
        role?: string;
        [key: string]: any;
    };
}

// Базовые типы для бизнес-логики
export interface User {
    id: string;
    email: string;
    username?: string;
    avatar_url?: string;
    role?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Video {
    id: string;
    title: string;
    description?: string;
    url: string;
    thumbnail_url?: string;
    user_id: string;
    created_at?: Date;
    updated_at?: Date;
    views_count?: number;
}

export interface Reaction {
    id: string;
    video_id: string;
    user_id: string;
    type: 'like' | 'dislike';
    created_at?: Date;
}

export interface Subscription {
    id: string;
    subscriber_id: string; // кто подписался
    channel_id: string;    // на кого подписался
    created_at?: Date;
}

export interface View {
    id: string;
    video_id: string;
    user_id?: string;
    viewed_at: Date;
}

export interface History {
    id: string;
    user_id: string;
    video_id: string;
    timestamp?: number;  // Время просмотра в секундах
    viewed_at: Date;
} 