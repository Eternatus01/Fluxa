export interface Tag {
    id: string;
    name: string;
    created_at?: string;
}

export interface TagResponse {
    data: Tag;
    message?: string;
}

export interface TagsResponse {
    data: Tag[];
    message?: string;
}

export interface TagError {
    message: string;
    status?: number;
}

export interface CreateTagParams {
    name: string;
}

export interface GetTagByNameParams {
    name: string;
}

export interface GetTagsByVideoParams {
    video_id: string;
}

export interface AddTagToVideoParams {
    video_id: string;
    tag_id: string;
}

export interface RemoveTagFromVideoParams {
    video_id: string;
    tag_id: string;
}