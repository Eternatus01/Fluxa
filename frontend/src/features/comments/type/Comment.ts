export interface User {
    id: string;
    username: string;
    avatar_url?: string;
}

export interface Comment {
    id: string;
    video_id: string;
    user_id: string;
    text: string;
    parent_id?: string | null;
    user?: {
        id: string;
        username: string | null;
        channel_name: string;
        avatar_url: string;
    };
    created_at?: string;
    likes_count: number;
    dislikes_count: number;
    replies?: Comment[];
    reply_count?: number;
}

export interface CommentResponse {
    data: Comment;
    message?: string;
}

export interface CommentsResponse {
    data: Comment[];
    message?: string;
}

export interface CommentError {
    message: string;
    status?: number;
    field?: string;
}

export interface AddCommentParams {
    video_id: string;
    user_id: string;
    text: string;
    parent_id?: string;
}

export interface DeleteCommentParams {
    comment_id: string;
}