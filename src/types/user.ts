export type User = {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    url_avatar: string | null;
    url_background: string | null;
    is_active: boolean;
    is_online: boolean;
    role: "USER" | "ADMIN" | string; // thêm các role khác nếu có
};
