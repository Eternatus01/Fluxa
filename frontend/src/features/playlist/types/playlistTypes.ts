export interface Playlist {
    id: string;
    title: string;
    description: string;
    is_public: boolean;
    created_at: string;
    thumbnail_url: string | null;
    video_count: number;
    user_id: string;
    channel_name?: string;
    avatar_url?: string;
    videos?: PlaylistVideo[];
    is_own?: boolean;
    is_subscribed?: boolean;
}

export interface PlaylistVideo {
    id: string;
    title: string;
    description: string;
    video_url: string;
    thumbnail_url: string;
    created_at: string;
    views: number;
    likes_count: number;
    dislikes_count: number;
    user_id: string;
    channel_name?: string;
    avatar_url?: string;
    type?: string;
    added_at?: string;
}

export interface AddVideoToPlaylistRequest {
    playlist_id: string;
    video_id: string;
    user_id: string;
}

export interface RemoveVideoFromPlaylistRequest {
    playlist_id: string;
    video_id: string;
    user_id: string;
}

export interface CreatePlaylistRequest {
    user_id: string;
    title: string;
    description?: string;
    is_public?: boolean;
    thumbnail_url?: string | null;
}

export interface UpdatePlaylistRequest {
    playlist_id: string;
    user_id: string;
    title: string;
    description: string;
    is_public: boolean;
    thumbnail_url: string | null;
} 