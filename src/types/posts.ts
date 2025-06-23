export type Media = {
    id: number;
    media: string;
    uploaded_at: string;
};

export type Post = {
    id: number;
    content: string;
    created_at: string;
    media_list: Media[];
    user: number;
    type_post: "IMAGE" | "VIDEO" | "TEXT" | string;
    visibility: "PUBLIC" | "PRIVATE" | "FRIEND" | string;
    number_comment: string;
    number_emotion: string;
    number_share: string;
};
