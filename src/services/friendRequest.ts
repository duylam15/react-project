import axios from "axios";

export const getFriendList = (userId: number) =>
    axios.get(`http://localhost:8000/api/friends/user/${userId}/`, {
        withCredentials: true,
    });

// Gửi lời mời kết bạn
export const sendFriendRequest = (from_user: number, to_user: number) =>
    axios.post(
        "http://localhost:8000/api/friend-requests/",
        { from_user, to_user },
        {
            withCredentials: true,
        }
    );

// Chấp nhận lời mời kết bạn
export const acceptFriendRequest = (requestId: number) =>
    axios.post(
        `http://localhost:8000/api/friend-requests/${requestId}/accept/`,
        {}, // body rỗng
        {
            withCredentials: true,
        }
    );

// Từ chối lời mời kết bạn
export const declineFriendRequest = (requestId: number) =>
    axios.post(
        `http://localhost:8000/api/friend-requests/${requestId}/decline/`,
        {}, // body rỗng
        {
            withCredentials: true,
        }
    );

// Lấy trạng thái mối quan hệ
export const getFriendStatus = (myId: number, otherId: number) =>
    axios.get(
        `http://localhost:8000/api/friend-requests/status/?from=${myId}&to=${otherId}`,
        {
            withCredentials: true,
        }
    );
