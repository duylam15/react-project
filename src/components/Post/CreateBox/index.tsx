import { useTranslation } from "react-i18next";
import styles from "./CreateBox.module.css";
import { useState } from "react";
import usePostStore from "../../../stores/postStore";
import { createPost } from "../../../services/post";

interface CreateBoxProps {
	onClose: () => void;
}

export default function CreateBox({ onClose }: CreateBoxProps) {
	const { t } = useTranslation();
	const [content, setContent] = useState("");
	const [typePost, setTypePost] = useState("IMAGE");
	const [mediaFiles, setMediaFiles] = useState<File[]>([]);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const doRefresh = usePostStore(state => state.doRefresh);

	// Xử lý chọn file
	const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			setMediaFiles(prev => [
				...prev,
				...Array.from(files)
			]);
		}
	};


	// Xử lý submit
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		try {
			const formData = new FormData();
			formData.append("content", content);
			formData.append("type_post", typePost);

			// Nếu có file ảnh/video
			if (mediaFiles.length > 0) {
				mediaFiles.forEach((file) => {
					formData.append("media", file);
				});
			}


			const res = await createPost(formData);

			setMessage("Đăng bài thành công!");
			setContent("");
			setTypePost("IMAGE");
			setMediaFiles([]);
			// Có thể gọi callback hoặc reload danh sách post nếu muốn
			doRefresh()
		} catch (error) {
			setMessage("Đăng bài thất bại!");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.box} onClick={(e) => e.stopPropagation()}>
				<form className="p-4 bg-white rounded-lg shadow mb-4" onSubmit={handleSubmit}>
					<h2 className="font-bold mb-2 text-lg">Tạo bài viết mới</h2>
					<textarea
						className="w-full border rounded p-2 mb-2"
						placeholder="Bạn đang nghĩ gì?"
						value={content}
						onChange={e => setContent(e.target.value)}
						rows={3}
						required
					/>

					<div className="mb-2">
						<label className="mr-2">Loại bài:</label>
						<select
							value={typePost}
							onChange={e => setTypePost(e.target.value)}
							className="border rounded px-2 py-1"
						>
							<option value="IMAGE">Ảnh</option>
							<option value="VIDEO">Video</option>
							<option value="TEXT">Text</option>
						</select>
					</div>

					<div className="mb-2">
						<label>Chọn media (nhiều ảnh/video):</label>
						<input
							type="file"
							multiple
							onChange={handleMediaChange}
							className="block mt-1"
						/>
					</div>

					{mediaFiles?.length > 0 && (
						<div className="flex gap-2 mt-2 flex-wrap">
							{mediaFiles.map((file, idx) => (
								<img
									key={idx}
									src={URL.createObjectURL(file)}
									alt={`preview-${idx}`}
									className="w-20 h-20 object-cover rounded"
								/>
							))}
						</div>
					)}



					<button
						type="submit"
						className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
						disabled={loading}
					>
						{loading ? "Đang đăng..." : "Đăng bài"}
					</button>
					{message && <p className="mt-2 text-center text-sm">{message}</p>}
				</form>
			</div>
		</div>
	);
}
