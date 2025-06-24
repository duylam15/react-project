import { useState } from "react";
import axios from "axios";

interface MessageInputProps {
	conversationId: number;
	senderId: number;
	onSendMessage?: (msg: any) => void; // optional callback
}

export default function MessageInput({ conversationId, senderId, onSendMessage }: MessageInputProps) {
	const [content, setContent] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!content.trim()) return;

		try {
			const res = await axios.post(
				"http://localhost:8000/api/messages/",
				{
					content,
					conversation: conversationId,
					sender: senderId,
				},
				{ withCredentials: true }
			);

			if (onSendMessage) onSendMessage(res.data);
			setContent("");
		} catch (err) {
			console.error("❌ Gửi tin nhắn thất bại:", err);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="Nhập tin nhắn..."
				className="flex-1 p-2 border rounded-full resize-none"
			/>
			<button
				type="submit"
				className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
			>
				Gửi
			</button>
		</form>
	);
}
