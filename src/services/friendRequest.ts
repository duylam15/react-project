import instance from "../helpers/axios"; // hoặc đường dẫn đến file axios của bạn

export const getFriendList = (userId: number) =>
    instance.get(`/friends/user/${userId}/`, {
        withCredentials: true,
    });

// Gửi lời mời kết bạn
export const sendFriendRequest = (from_user: number, to_user: number) =>
    instance.post(
        "/friend-requests/",
        { from_user, to_user },
        {
            withCredentials: true,
        }
    );

// Chấp nhận lời mời kết bạn
export const acceptFriendRequest = (requestId: number) =>
    instance.post(
        `/friend-requests/${requestId}/accept/`,
        {}, // body rỗng
        {
            withCredentials: true,
        }
    );

// Từ chối lời mời kết bạn
export const declineFriendRequest = (requestId: number) =>
    instance.post(
        `/friend-requests/${requestId}/decline/`,
        {}, // body rỗng
        {
            withCredentials: true,
        }
    );

// Lấy trạng thái mối quan hệ
export const getFriendStatus = (myId: number, otherId: number) =>
    instance.get(`/friend-requests/status/?from=${myId}&to=${otherId}`, {
        withCredentials: true,
    });

export const checkFriendship = async (user1Id: number, user2Id: number) => {
    return instance.get(`/friends/check/`, {
        params: { user1: user1Id, user2: user2Id },
        withCredentials: true,
    });
};
