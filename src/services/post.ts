import instance from "../helpers/axios";

// Lấy 1 hoặc nhiều post (url là dạng "/posts/?limit=5&offset=0" hoặc chỉ "/posts/1")
export const getPost = async (url: string) => {
    const res = await instance.get(url, { withCredentials: true });
    return res;
};

// Tạo mới post
export const createPost = async (postData: any) => {
    const res = await instance.post("/posts/", postData, {
        withCredentials: true,
    });
    return res;
};

// Sửa post (update)
export const updatePost = async (id: any, postData: any) => {
    const res = await instance.patch(`/posts/${id}/`, postData, {
        withCredentials: true,
    });
    return res;
};

// Xóa post
export const deletePost = async (id: number) => {
    const res = await instance.delete(`/posts/${id}/`, {
        withCredentials: true,
    });
    return res;
};
