import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CommentInput from "../../components/CommentInput/CommentInput";
import { getUserConversations } from "../../services/conversation";
import MessageInput from "../../components/MessageInput";

export default function Messages() {
	const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
	const [conversations, setConversations] = useState<any[]>([]);
	const { t } = useTranslation();

	const getUserId = () => {
		try {
			const userStorage = localStorage.getItem("user-storage");
			if (!userStorage) return null;
			const parsed = JSON.parse(userStorage);
			return parsed.state?.user?.id || null;
		} catch (err) {
			console.error("Lỗi lấy user id:", err);
			return null;
		}
	};

	const userId = getUserId();

	useEffect(() => {
		const fetchConversations = async () => {
			const userId = getUserId();
			if (!userId) return;
			try {
				const res = await getUserConversations(userId);
				setConversations(res.data);
			} catch (err) {
				console.error("Lỗi lấy danh sách conversations:", err);
			}
		};
		fetchConversations();
	}, []);

	return (
		<div className="flex w-full h-screen">
			{/* Sidebar danh sách conversation */}
			<div className="w-[400px] border-r overflow-y-auto">
				<h2 className="p-4 pt-6 font-bold text-xl">{t("messages")}</h2>
				{conversations.map((conv) => {
					// Hiển thị người còn lại trong cuộc trò chuyện
					const currentUserId = getUserId();
					const otherUser = conv.members.find((m: any) => m.id !== currentUserId);
					return (
						<div
							key={conv.id}
							className={`p-4 cursor-pointer hover:bg-gray-100 flex items-center ${selectedConversationId === conv.id ? "bg-gray-200" : ""}`}
							onClick={() => {
								setSelectedConversationId(conv.id);
								console.log("Conversation selected:", conv);
							}}
						>
							<img
								src={otherUser?.url_avatar || "https://i.pravatar.cc/150?img=1"}
								alt="avatar"
								className="w-10 h-10 rounded-full mr-3"
							/>
							<div>
								<p className="font-semibold">{otherUser?.username || "Unknown"}</p>
								<p className="text-sm text-gray-500">{conv.name}</p>
							</div>
						</div>
					);
				})}
			</div>

			{/* Chat box */}
			<div className="flex-1 flex flex-col">
				{selectedConversationId ? (
					<>
						<div className="p-4 border-b font-semibold">
							Conversation ID: {selectedConversationId}
						</div>
						<div className="flex-1 p-4 overflow-y-auto">
							{/* Message content placeholder */}
							<p className="mb-2 p-2 bg-gray-200 rounded-xl inline-block">Hello!</p>
							<p className="mb-2 p-2 bg-blue-500 text-white rounded-xl inline-block ml-auto">Hi!</p>
						</div>
						<div className="border-t p-4">
							<MessageInput conversationId={selectedConversationId} senderId={userId} onSendMessage={(msg) => console.log("Đã gửi:", msg)} />

						</div>
					</>
				) : (
					<div className="flex justify-center items-center h-full text-gray-400">
						{t("Select a conversation")}
					</div>
				)}
			</div>
		</div>
	);
}
