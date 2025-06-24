import axios from "axios";

// Tạo mới cuộc trò chuyện
export const createConversation = (name: string, created_by: number) =>
    axios.post(
        "http://localhost:8000/api/conversations/",
        { name, created_by },
        { withCredentials: true }
    );

export const getUserConversations = (userId: number) => {
    return axios.get(
        `http://localhost:8000/api/conversations/?user_id=${userId}`,
        { withCredentials: true }
    );
};

// Thêm thành viên vào cuộc trò chuyện
export const addMemberToConversation = (
    conversationId: number,
    userId: number
) =>
    axios.post(
        `http://localhost:8000/api/conversations/${conversationId}/add_member/`,
        { user_id: userId },
        { withCredentials: true }
    );
