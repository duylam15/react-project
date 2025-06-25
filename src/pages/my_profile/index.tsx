import { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useParams } from "react-router-dom";
import { getUser, updateUser } from "../../services/user";
import { connectSocket, disconnectSocket } from "../../helpers/socket";
import { getFriendStatus, acceptFriendRequest, declineFriendRequest, sendFriendRequest } from "../../services/friendRequest";
import { createConversation, addMemberToConversation } from "../../services/conversation";
import usePostStore from "../../stores/postStore";
import axios from "axios";
import AvatarSection from "./AvatarSection";
import ProfileInfo from "./ProfileInfo";
import PostGallery from "./PostGallery";
import EditProfileModal from "./EditProfileModal";

export default function MyProfile() {
	const { id } = useParams();
	const { theme } = useTheme();
	const iconColor = theme === "dark" ? "white" : "black";

	const getUserId = () => {
		try {
			const userStorage = localStorage.getItem("user-storage");
			if (!userStorage) return null;
			const parsed = JSON.parse(userStorage);
			return parsed.state?.user?.id || null;
		} catch (err) {
			console.error("Lỗi lấy userId:", err);
			return null;
		}
	};

	const myUserId = getUserId();
	const viewedUserId = id ? Number(id) : myUserId;
	const isOwnProfile = !id || Number(id) === Number(myUserId);
	const [user, setUser] = useState<any>(null);
	const [friendStatus, setFriendStatus] = useState<any>();
	const [requestId, setRequestId] = useState<number | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [newUsername, setNewUsername] = useState("");
	const [newAvatar, setNewAvatar] = useState("");

	const { refresh, doRefresh } = usePostStore();

	useEffect(() => {
		if (!viewedUserId) return;
		getUser(viewedUserId).then((res: any) => {
			setUser(res);
			setNewUsername(res.username);
			setNewAvatar(res.avatar);
		});
	}, [id, refresh]);

	useEffect(() => {
		const myId = getUserId();
		if (!user?.id || !myId || user.id === myId) return;

		getFriendStatus(myId, user.id).then((res: any) => {
			setFriendStatus(res.status);
			setRequestId(res.request_id || null);
		});
	}, [user]);

	useEffect(() => {
		const myId = getUserId();
		if (!myId) return;
		const handler = (data: any) => {
			if (data.type === "friend_request" && data.from_user_id === user?.id) {
				setFriendStatus("received");
				setRequestId(data.request_id);
			} else if (data.type === "friend_accept") {
				setFriendStatus("friends");
			} else if (data.type === "friend_decline") {
				setFriendStatus("none");
				setRequestId(null);
			}
		};
		connectSocket(myId, handler);
		return () => disconnectSocket();
	}, [user]);

	const handleSendRequest = async () => {
		await sendFriendRequest(myUserId, user.id);
		setFriendStatus("sent");
	};

	const handleAccept = async () => {
		if (!requestId) return;
		await acceptFriendRequest(requestId);
		setFriendStatus("friends");
		const conv: any = await createConversation("Chat mới", myUserId);
		await addMemberToConversation(conv.id, myUserId);
		await addMemberToConversation(conv.id, user.id);
	};

	const handleDecline = async () => {
		if (!requestId) return;
		await declineFriendRequest(requestId);
		setFriendStatus("none");
	};

	const handleAvatarUpload = async (file: File) => {
		const formData = new FormData();
		formData.append("avatar_file", file);
		const res = await axios.post(`http://localhost:8000/api/users/${myUserId}/upload-avatar/`, formData, {
			withCredentials: true,
			headers: { "Content-Type": "multipart/form-data" },
		});
		setUser((prev: any) => ({ ...prev, avatar: res.data.avatar_key, avatar_url: res.data.avatar_url }));
		doRefresh();
	};

	const handleSaveProfile = async () => {
		await updateUser(myUserId, { username: newUsername, avatar: newAvatar });
		setUser((prev: any) => ({ ...prev, username: newUsername, avatar: newAvatar }));
		setIsEditModalOpen(false);
	};

	const imageList = [
		"/images/uifaces-popular-image (12).jpg",
		"/images/uifaces-popular-image (13).jpg",
		"/images/uifaces-popular-image (14).jpg",
		"/images/uifaces-popular-image (5).jpg",
		"/images/uifaces-popular-image (6).jpg",
		"/images/uifaces-popular-image (7).jpg",
		"/images/uifaces-popular-image (14).jpg",
	];

	return (
		<div className="ml-25 p-4 flex flex-col items-center">
			<div className="flex gap-10">
				<AvatarSection
					user={user}
					isOwnProfile={isOwnProfile}
					onUpload={handleAvatarUpload}
				/>

				<ProfileInfo
					user={user}
					isOwnProfile={isOwnProfile}
					iconColor={iconColor}
					friendStatus={friendStatus}
					onEdit={() => setIsEditModalOpen(true)}
					onAccept={handleAccept}
					onDecline={handleDecline}
					onSendRequest={handleSendRequest}
				/>

			</div>
			<PostGallery images={imageList} />

			<EditProfileModal
				isOpen={isEditModalOpen}
				username={newUsername}
				onClose={() => setIsEditModalOpen(false)}
				onChangeUsername={setNewUsername}
				onSave={handleSaveProfile}
			/>
		</div>
	);
}