export interface HistoryVideo {
    id: string;
    title: string;
    thumbnail_url: string;
    views: number;
    created_at: string;
    user: {
        avatar_url: string;
        channel_name: string;
    };
}

export interface HistoryItem {
    video: HistoryVideo;
    watched_at: string;
}

export interface HistoryState {
    history: HistoryItem[];
    isLoading: boolean;
    error: Error | null;
} 