import { useTranslation } from "react-i18next";
import styles from "../CreateBox/CreateBox.module.css";
import { useState } from "react";
import usePostStore from "../../../stores/postStore";
import { updatePost } from "../../../services/post";

interface MediaItem {
	id: number;
	url: string;
}

interface EditBoxProps {
	postId: number | string;
	content: string;
	typePost: string;
	mediaList: any;
	onClose: () => void;
	onUpdated?: () => void;
}

export default function EditBox({
	postId,
	content: initContent,
	typePost: initType,
	mediaList: initMediaList,
	onClose,
	onUpdated,
}: EditBoxProps) {
	const { t } = useTranslation();
	const [content, setContent] = useState(initContent);
	const [typePost, setTypePost] = useState(initType);
	const [mediaOld, setMediaOld] = useState<MediaItem[]>(initMediaList); // media cũ giữ lại
	const [mediaFiles, setMediaFiles] = useState<File[]>([]);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const doRefresh = usePostStore(state => state.doRefresh);

	// Xoá ảnh cũ khỏi danh sách giữ lại
	const handleRemoveOldMedia = (id: number) => {
		setMediaOld((prev) => prev.filter((m) => m.id !== id));
	};

	// Chọn file mới
	const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			setMediaFiles((prev) => [...prev, ...Array.from(files)]);
		}
	};

	// Xoá ảnh mới trước khi upload
	const handleRemoveNewMedia = (index: number) => {
		setMediaFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		try {
			const formData = new FormData();
			formData.append("content", content);
			formData.append("type_post", typePost);

			// Media mới
			mediaFiles.forEach((file) => {
				formData.append("media", file);
			});

			// Gửi danh sách ID media cũ giữ lại
			const remainMediaIds = mediaOld.map((m) => m.id);
			formData.append("media_keep", JSON.stringify(remainMediaIds));

			await updatePost(postId, formData);

			setMessage("Cập nhật thành công!");
			doRefresh()
			if (onUpdated) onUpdated();
			onClose();
		} catch (err) {
			console.error(err);
			setMessage("Cập nhật thất bại.");
		} finally {
			setLoading(false);
		}
	};

	console.log("mediaOldmediaOld", mediaOld)

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.box} onClick={(e) => e.stopPropagation()}>
				<form className="p-4 bg-white rounded-lg shadow" onSubmit={handleSubmit}>
					<h2 className="font-bold mb-2 text-lg">Chỉnh sửa bài viết</h2>

					<textarea
						className="w-full border rounded p-2 mb-2"
						placeholder="Bạn đang nghĩ gì?"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						rows={3}
					/>

					<div className="mb-2">
						<label className="mr-2">Loại bài:</label>
						<select
							value={typePost}
							onChange={(e) => setTypePost(e.target.value)}
							className="border rounded px-2 py-1"
						>
							<option value="IMAGE">Ảnh</option>
							<option value="VIDEO">Video</option>
							<option value="TEXT">Text</option>
						</select>
					</div>

					{/* Media cũ */}
					{mediaOld.length > 0 && (
						<div className="mb-2">
							<p className="font-semibold text-sm mb-1">Ảnh đã đăng:</p>
							<div className="flex gap-2 flex-wrap">
								{mediaOld.map((m: any) => (
									<div key={m.id} className="relative">
										<img
											src={m?.media}
											alt="old-media"
											className="w-20 h-20 object-cover rounded"
										/>
										<button
											type="button"
											onClick={() => handleRemoveOldMedia(m.id)}
											className="absolute top-0 right-0 text-white bg-red-500 rounded-full w-5 h-5 text-xs"
										>
											×
										</button>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Media mới */}
					<div className="mb-2">
						<label>Thêm media mới:</label>
						<input type="file" multiple onChange={handleMediaChange} className="block mt-1" />
						{mediaFiles.length > 0 && (
							<div className="flex gap-2 mt-2 flex-wrap">
								{mediaFiles.map((file, idx) => (
									<div key={idx} className="relative">
										<img
											src={URL.createObjectURL(file)}
											alt={`new-${idx}`}
											className="w-20 h-20 object-cover rounded"
										/>
										<button
											type="button"
											onClick={() => handleRemoveNewMedia(idx)}
											className="absolute top-0 right-0 text-white bg-red-500 rounded-full w-5 h-5 text-xs"
										>
											×
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					<button
						type="submit"
						className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
						disabled={loading}
					>
						{loading ? "Đang cập nhật..." : "Cập nhật"}
					</button>
					{message && <p className="mt-2 text-center text-sm">{message}</p>}
				</form>
			</div>
		</div>
	);
}