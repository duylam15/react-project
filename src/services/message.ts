import instance from "../helpers/axios";

export const getMessagesByConversation = async (conversationId: number) => {
    try {
        const res = await instance.get(
            `/messages/by-conversation/${conversationId}/`,
            {
                withCredentials: true,
            }
        );
        console.log("res getMessagesByConversation", res);
        return res;
    } catch (error) {
        console.error(
            `Lỗi khi lấy tin nhắn của cuộc trò chuyện ${conversationId}:`,
            error
        );
        throw error;
    }
};
