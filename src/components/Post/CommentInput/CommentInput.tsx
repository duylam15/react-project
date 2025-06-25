// src/components/CommentBox.js
import { useState } from "react";
import axios from "axios";
import usePostStore from "../../../stores/postStore";

export default function CommentInput({ postId, onComment }: { postId: any, onComment: any }) {
	const [content, setContent] = useState("");
	const doRefresh = usePostStore(state => state.doRefresh);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (!content.trim()) return;

		try {
			const res = await axios.post(
				"http://localhost:8000/api/comments/",
				{
					post: postId,
					content,
					type_comment: "NORMAL",
					parent: null
				},
				{
					withCredentials: true,
				}

			);
			doRefresh()
			onComment(res.data);
			setContent("");
		} catch (err) {
			console.error("❌ Failed to post comment", err);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="Nhập bình luận..."
			/>
			<button type="submit">Gửi</button>
		</form>
	);
}
