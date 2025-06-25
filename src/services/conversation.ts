import instance from "../helpers/axios"; // hoặc đường dẫn đến file axios của bạn

// Tạo mới cuộc trò chuyện
export const createConversation = (name: string, created_by: number) =>
    instance.post(
        "/conversations/",
        { name, created_by },
        { withCredentials: true }
    );

export const getUserConversations = (userId: number) => {
    return instance.get(
        `/conversations/user/${userId}`,
        {
            withCredentials: true,
        }
    );
};

// Thêm thành viên vào cuộc trò chuyện
export const addMemberToConversation = (
    conversationId: number,
    userId: number
) =>
    instance.post(
        `/conversations/${conversationId}/add_member/`,
        { user_id: userId },
        { withCredentials: true }
    );
