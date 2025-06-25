import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getUserConversations } from "../../services/conversation";
import { getMessagesByConversation } from "../../services/message";
import MessageInput from "../../components/MessageInput";
import { connectSocket, disconnectSocket } from "../../helpers/socket";
import usePostStore from "../../stores/postStore";

export default function Messages() {
	const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
	const [conversations, setConversations] = useState<any[]>([]);
	const [messages, setMessages] = useState<any[]>([]);
	const { t } = useTranslation();
	const doRefresh = usePostStore(state => state.doRefresh);
	const refresh = usePostStore(state => state.refresh);
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
		if (!userId) return;

		const handleNewMessage = (data: any) => {
			if (data.conversation_id === selectedConversationId) {
				setMessages((prev) => [...prev, data]);
			}
		};
		doRefresh()
		connectSocket(userId, handleNewMessage);

		return () => {
			disconnectSocket();
		};
	}, [userId, selectedConversationId]);


	useEffect(() => {
		const fetchConversations = async () => {
			if (!userId) return;
			try {
				const res: any = await getUserConversations(userId);
				setConversations(res);
			} catch (err) {
				console.error("Lỗi lấy danh sách conversations:", err);
			}
		};
		fetchConversations();
	}, [userId]);

	useEffect(() => {
		const fetchMessages = async () => {
			if (!selectedConversationId) return;
			try {
				const res: any = await getMessagesByConversation(selectedConversationId);
				setMessages(res);
			} catch (err) {
				console.error("Lỗi lấy message:", err);
			}
		};
		fetchMessages();
	}, [selectedConversationId, refresh]);

	console.log("messages", messages)
	console.log("selectedConversationId", selectedConversationId)

	return (
		<div className="flex w-full h-screen">
			{/* Sidebar danh sách conversation */}
			<div className="w-[400px] border-r overflow-y-auto">
				<h2 className="p-4 pt-6 font-bold text-xl">{t("messages")}</h2>
				{conversations.map((conv) => {
					const otherUser = conv.members.find((m: any) => m.id !== userId);
					return (
						<div
							key={conv.id}
							className={`p-4 cursor-pointer hover:bg-gray-100 flex items-center ${selectedConversationId === conv.id ? "bg-gray-200" : ""
								}`}
							onClick={() => setSelectedConversationId(conv.id)}
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
							{messages?.map((msg) => (
								<div
									key={msg.id}
									className={`mb-2 p-2 rounded-xl max-w-xs ${msg.sender === userId
										? "bg-blue-500 text-white ml-auto"
										: "bg-gray-200"
										}`}
								>
									{msg.content}
								</div>
							))}
						</div>
						<div className="border-t p-4">
							<MessageInput
								conversationId={selectedConversationId}
								senderId={userId}
								onSendMessage={(newMsg) => setMessages((prev) => [...prev, newMsg])}
							/>
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
