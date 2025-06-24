import { Carousel, Modal } from "antd";
import React, { useEffect, useState } from "react";
import CommentInput from "../../components/CommentInput/CommentInput";
import { IconDots } from "../../components/icons/ic_dots";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getUser } from "../../services/user";
import { acceptFriendRequest, declineFriendRequest, getFriendStatus, sendFriendRequest } from "../../services/friendRequest";
import { connectSocket, disconnectSocket } from "../../helpers/socket";
import { addMemberToConversation, createConversation } from "../../services/conversation";

export default function MyProfile() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [user, setUser] = useState<any>(null);
	const images = [
		"/images/uifaces-popular-image (12).jpg",
		"/images/uifaces-popular-image (13).jpg",
		"/images/uifaces-popular-image (14).jpg",
		"/images/uifaces-popular-image (5).jpg",
		"/images/uifaces-popular-image (6).jpg",
		"/images/uifaces-popular-image (7).jpg",
		"/images/uifaces-popular-image (14).jpg",
	];
	const getUserId = () => {
		try {
			const userStorage = localStorage.getItem("user-storage");
			if (!userStorage) return null;
			const parsed = JSON.parse(userStorage);
			return parsed.state?.user?.id || null;
		} catch (err) {
			console.error("Lỗi khi lấy userId từ localStorage:", err);
			return null;
		}
	};
	let userId: any
	const { id } = useParams(); // <-- lấy id từ URL

	if (!id) {
		userId = getUserId();
	}
	else
		userId = id

	useEffect(() => {
		const fetchUser = async () => {
			try {
				if (!userId) return;
				const res: any = await getUser(userId);
				setUser(res);
			} catch (err) {
				console.error("Không thể tải thông tin người dùng", err);
			}
		};
		fetchUser();
	}, [id]);

	console.log("user", user)

	// Hàm mở modal khi click vào ảnh
	const handleImageClick = (img: any) => {
		setSelectedImage(img);
		setIsModalOpen(true);
	};

	const [friendStatus, setFriendStatus] = useState<"none" | "sent" | "received" | "friends">("none");
	const [requestId, setRequestId] = useState<number | null>(null);

	useEffect(() => {
		const checkStatus = async () => {
			const myId = getUserId();
			if (!user?.id || !myId || user.id === myId) return;

			try {
				const res = await getFriendStatus(myId, user.id);
				setFriendStatus(res.data.status); // ex: 'sent', 'received', 'friends', 'none'
				setRequestId(res.data.request_id || null);
			} catch (err) {
				console.error("Lỗi lấy trạng thái kết bạn", err);
			}
		};
		checkStatus();
	}, [user]);


	useEffect(() => {
		const myId = getUserId();
		if (!myId) return;

		const handleSocketMessage = (data: any) => {
			if (data.type === "friend_request") {
				console.log("📩 Nhận lời mời kết bạn", data);
				if (data.request_id && user?.id === data.from_user_id) {
					setFriendStatus("received");
					setRequestId(data.request_id);
				}
			} else if (data.type === "friend_accept") {
				console.log("🤝 Lời mời được chấp nhận", data);
				setFriendStatus("friends");
			} else if (data.type === "friend_decline") {
				console.log("🚫 Lời mời bị từ chối", data);
				setFriendStatus("none");
				setRequestId(null);
			}
		};

		connectSocket(myId, handleSocketMessage);
		return () => {
			disconnectSocket();
		};
	}, [user]);


	const handleSendRequest = async () => {
		try {
			await sendFriendRequest(getUserId(), user.id);
			setFriendStatus("sent");
		} catch (err) {
			console.error("Gửi lời mời thất bại", err);
		}
	};


	// Hàm xử lý chấp nhận
	const handleAccept = async () => {
		if (!requestId) return;
		try {
			await acceptFriendRequest(requestId);
			setFriendStatus("friends");

			const myId = getUserId();
			const friendId = user.id;

			// Tạo cuộc trò chuyện
			const convRes = await createConversation("Cuộc trò chuyện mới", myId);
			const conversationId = convRes.data.id;

			// Thêm cả 2 người vào cuộc trò chuyện
			await addMemberToConversation(conversationId, myId);
			await addMemberToConversation(conversationId, friendId);

			console.log("✅ Đã tạo conversation và thêm thành viên.");
		} catch (err) {
			console.error("Chấp nhận kết bạn thất bại", err);
		}
	};

	const handleDecline = async () => {
		if (!requestId) return;
		try {
			await declineFriendRequest(requestId);
			setFriendStatus("none");
		} catch (err) {
			console.error("Từ chối kết bạn thất bại", err);
		}
	};


	// Lấy giá trị theme từ context
	const { theme } = useTheme();

	// Lấy hàm dịch `t` từ i18n
	const { t } = useTranslation();
	const iconColor = theme === "dark" ? "white" : "black";

	return (
		<div className=" ml-25 p-4 flex flex-col items-center ">
			{/* Thông tin người dùng */}
			<div className="flex items-center gap-30 mb-8">
				{/* Ảnh đại diện */}
				<div className="w-[168px] h-[168px] rounded-full overflow-hidden border-2 p-1.5  border-pink-500">
					<img
						src="/images/uifaces-popular-image (11).jpg"
						alt="Avatar"
						className=" object-cover rounded-[99px]"
					/>
				</div>

				{/* Thông tin cá nhân */}
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-4 justify-center">
						<h2 className="text-xl font-normal">{user?.username}</h2>
						<div className="bg-gray-200 px-4 py-1 rounded-md font-medium text-[14px] text-center w-[148px] h-[32px] leading-[100%] flex items-center justify-center text-black-600" style={{ background: "var( --hover-color)" }}>
							{friendStatus === "friends" ? (
								<div className="btn">Bạn bè</div>
							) : friendStatus === "sent" ? (
								<div className="btn text-gray-500 cursor-default">Đã gửi lời mời</div>
							) : friendStatus === "received" ? (
								<>
									<button className="btn" onClick={() => handleAccept()}>
										Đồng ý
									</button>
									<button className="btn" onClick={() => handleDecline()}>
										Từ chối
									</button>
								</>
							) : (
								<button className="btn" onClick={() => handleSendRequest()}>
									Kết bạn
								</button>
							)}

						</div>
						<div className="bg-gray-200 px-4 py-1 rounded-md font-medium  text-[14px] text-center w-[100px] h-[32px] leading-[100%] flex items-center justify-center text-black-600" style={{ background: "var( --hover-color)" }}>
							Nhắn tin
						</div>
						<div className="bg-gray-200 px-4 py-1 rounded-md font-medium  text-[14px] text-center w-[30px] h-[32px] leading-[100%] flex items-center justify-center text-black-600" style={{ background: "var( --hover-color)" }}>
							+
						</div>
						<div className=" px-4 py-1 rounded-md font-medium  text-[14px] text-center w-[30px] h-[32px] leading-[100%] flex items-center justify-center text-black-600">
							<p className="text-gray-600"><IconDots color={iconColor} /></p>

						</div>
					</div>

					<div className="flex gap-6 mt-2">
						<span className="font-light"><strong className="font-bold">20</strong> {t('post')}</span>
						<span className="font-light"><strong className="font-bold">5.2K</strong> {t('follower')}</span>
						<span className="font-light"><strong className="font-bold">120</strong> {t('following')}</span>
					</div>

					<p className="mt-2 text-sm">Bio của bạn có thể ở đây ✨</p>
					<p className="mt-2 text-sm">Bio của bạn có thể ở đây ✨</p>
				</div>
			</div>
			{/* Danh sách bài viết */}
			{/* Danh sách ảnh */}
			<div className="grid grid-cols-3 gap-1">
				{images.map((img, index) => (
					<div key={index} className="aspect-square h-[410px] w-[308px] cursor-pointer" onClick={() => handleImageClick(img)}>
						<img src={img} alt="Post" className="w-full h-full object-cover" />
					</div>
				))}
			</div>
		</div>
	);
}
