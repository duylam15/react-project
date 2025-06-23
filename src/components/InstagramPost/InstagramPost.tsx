import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaComment, FaPaperPlane, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Modal, Carousel } from 'antd';
import { calc } from "antd/es/theme/internal";
import { IconDots } from "../icons/ic_dots";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import { Post } from "../../types/posts";
import { getUser } from "../../services/user";
import { User } from "../../types/user";
import { timeAgo } from "../../utils/date";
import { deletePost } from "../../services/post";
import { message } from "antd";
import usePostStore from "../../stores/postStore";
import EditBox from "../EditBox";
import CommentInput from "../CommentInput/CommentInput";

type InstagramPostProps = {
	post: Post;
	first?: string;
};

const InstagramPost = ({ post, first }: InstagramPostProps) => {
	const [liked, setLiked] = useState(false);
	const [saved, setSaved] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [user, setUser] = useState<User>()
	// Lấy giá trị theme từ context
	const { theme } = useTheme();
	const [showMenu, setShowMenu] = useState(false);

	// Lấy hàm dịch `t` từ i18n
	const { t } = useTranslation();
	const iconColor = theme === "dark" ? "white" : "black";
	const doRefresh = usePostStore(state => state.doRefresh);
	const refresh = usePostStore(state => state.refresh);

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

	const userId = getUserId();

	console.log("userId", userId)

	useEffect(() => {
		const fetchUser = async (id: number) => {
			if (post.user) {
				const res: any = await getUser(id);
				setUser(res)
			}
		};
		fetchUser(post.user);
	}, []);

	const handleToggleMenu = (e: React.MouseEvent) => {
		e.stopPropagation(); // Để tránh click lan ra ngoài nếu có
		setShowMenu((prev) => !prev);
	};

	useEffect(() => {
		if (!showMenu) return;
		const handleClick = () => setShowMenu(false);
		window.addEventListener("click", handleClick);
		return () => window.removeEventListener("click", handleClick);
	}, [showMenu]);

	const handleDeletePost = async (id: number) => {
		try {
			await deletePost(id);
			message.success("Xóa bài viết thành công!");  // Thông báo thành công
			console.log(refresh)
			doRefresh();
			// Nếu muốn reload lại list bài viết, gọi hàm fetch lại data ở đây
		} catch (err) {
			message.error("Xóa bài viết thất bại!");       // Thông báo lỗi nếu có
		}
	};

	return (
		<div className={`max-w-[470px] h-[900px] var(--bg-color) pt-2 ${first ? "" : "border-t border-gray-600"}`}>
			{/* Header */}
			<div className="flex items-center justify-between pt-3 pb-3 relative">
				<div className="flex items-center gap-3">
					<img
						src="/images/uifaces-popular-image (11).jpg"
						alt="Avatar"
						className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
					/>
					<span className="font-semibold text-gray-800" style={{ color: "var(--text-color)" }}>{user?.username}</span>
					<span className="font-normal text-[14px] text-gray-400" style={{ color: "var(--white-to-gray)" }}>{timeAgo(post?.created_at)}</span>
				</div>
				<div onClick={handleToggleMenu} className="text-gray-600 "><IconDots color={iconColor} /></div>
				{showMenu && (
					<div className="absolute right-0 z-10 top-15 bg-white border rounded shadow flex flex-col ">
						<button
							className="text-center hover:bg-gray-100 p-0 m-0"
							onClick={() => setShowEdit(true)}
						>
							Sửa
						</button>

						<button
							className=" text-center hover:bg-gray-100 text-red-500 p-0 m-0"
							onClick={() => {
								handleDeletePost(post?.id)
							}}
						>
							Xóa
						</button>
					</div>
				)}
			</div>
			{showEdit && (
				<EditBox
					postId={post.id}
					content={post.content}
					typePost={post.type_post}
					mediaList={post.media_list}
					onClose={() => setShowEdit(false)}
				// có thể thêm onUpdated nếu cần reload danh sách post
				/>

			)}
			{/* Post Image */}
			<Carousel
				infinite={false}
				arrows className="ant-custom">
				{post.media_list.map((media) => (
					<img key={media.id} src={media.media} alt="" className="w-full h-[585px] object-cover rounded-lg"
					/>
				))}

			</Carousel>

			{/* Actions */}
			<div className="flex justify-between pt-4">
				<div className="flex items-center gap-5">
					<p onClick={() => setLiked(!liked)} className="text-xl">
						{liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
					</p>
					<p className="text-xl"><FaComment /></p>
					<p className="text-xl"><FaPaperPlane /></p>
				</div>
				<p onClick={() => setSaved(!saved)} className="text-xl">
					{saved ? <FaBookmark /> : <FaRegBookmark />}
				</p>
			</div>
			{/* Likes and Caption */}
			<div className="pt-3">
				<p className="font-semibold">{post?.number_emotion} {t('likes')}</p>
				<p><span className="font-semibold">{user?.username}</span> {post?.content} </p><p className="cursor-pointer text-blue-500 font-semibold" onClick={() => setIsModalOpen(true)}>{t('view_more')} {post?.number_comment} {t('comment')} </p>
			</div>

			{/* Comment Input */}
			<div className="mt-2 pt-2 ">
				<CommentInput postId={post?.id} onComment={(c: any) => console.log("✅", c)} />
			</div>

			{/* Modal hiển thị hình ảnh + comments */}
			<Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={"70%"}
				centered className="model-custom" height={"90%"}>
				<div className="flex">
					{/* Hình ảnh bên trái */}
					<div className="w-[55%]">
						<Carousel infinite={false} arrows>
							{post.media_list.map((media) => (
								<img key={media.id} src={media.media} alt="" className="w-full h-[90vh] object-cover"
								/>
							))}
						</Carousel>
					</div>

					{/* Comments bên phải */}
					<div className="w-1/2 flex flex-col justify-between">
						<div className="overflow-y-auto h-[400px]">
							<div className="flex p-5 justify-between items-center gap-3 border-b  pb-3"
								style={{ borderColor: "var(--white-to-gray)" }}>
								<div className="flex items-center justify-center gap-3">
									<img
										src="/images/uifaces-popular-image (11).jpg"
										alt="Avatar"
										className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
									/>
									<span className="font-semibold" style={{ color: "var(--text-color)" }}>username</span>
								</div>

								<div className="text-gray-600"><IconDots color={iconColor} /></div>
							</div>
							<div className="pt-2 pl-5 pr-5 flex flex-col items-start gap-3">
								<div className="flex  items-center gap-3">
									<img
										src="/images/uifaces-popular-image (11).jpg"
										alt="Avatar"
										className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
									/>
									<div className="flex flex-col items-center">
										<span className="font-semibold" style={{ color: "var(--text-color)" }}>username</span>

										<span className="font-semibold" style={{ color: "var(--text-color)" }}>username</span>

									</div>
								</div>
								<div className="flex  items-center gap-3">
									<img
										src="/images/uifaces-popular-image (11).jpg"
										alt="Avatar"
										className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
									/>
									<div className="flex flex-col items-center">
										<span className="font-semibold" style={{ color: "var(--text-color)" }}>username</span>

										<span className="font-semibold" style={{ color: "var(--text-color)" }}>username</span>

									</div>
								</div><div className="flex  items-center gap-3">
									<img
										src="/images/uifaces-popular-image (11).jpg"
										alt="Avatar"
										className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
									/>
									<div className="flex flex-col items-center">
										<span className="font-semibold" style={{ color: "var(--text-color)" }}>username</span>

										<span className="font-semibold" style={{ color: "var(--text-color)" }}>username</span>

									</div>
								</div><div className="flex  items-center gap-3">
									<img
										src="/images/uifaces-popular-image (11).jpg"
										alt="Avatar"
										className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
									/>
									<div className="flex flex-col items-center">
										<span className="font-semibold" style={{ color: "var(--text-color)" }}>username</span>

										<span className="font-semibold" style={{ color: "var(--text-color)" }}>username</span>

									</div>
								</div>
							</div>
							{/* Thêm comments giả lập */}
						</div>
						{/* Actions */}
						<div className="flex justify-between p-4 pb-0 border-t" style={{ borderColor: "var(--white-to-gray)" }}>
							<div className="flex items-center gap-5">
								<p onClick={() => setLiked(!liked)} className="text-xl">
									{liked ? <FaHeart className="text-red-500" /> : <FaRegHeart style={{ color: "var(--text-color)" }} />}
								</p>
								<p className="text-xl" style={{ color: "var(--text-color)" }}><FaComment /></p>
								<p className="text-xl"><FaPaperPlane style={{ color: "var(--text-color)" }} /></p>
							</div>
							<p onClick={() => setSaved(!saved)} className="text-xl">
								{saved ? <FaBookmark style={{ color: "var(--text-color)" }} /> : <FaRegBookmark style={{ color: "var(--text-color)" }} />}
							</p>
						</div>
						<div className="p-4 pt-0">
							<p className="font-semibold text-[16px]" style={{ color: "var(--text-color)" }}>1,234 {t('likes')}</p>
							<p className="font-light" style={{ color: "var(--text-color)" }}>20 {t('hour')}</p>
						</div>
						<div className="pl-5 pr-5 border-t "
							style={{ borderColor: "var(--white-to-gray)" }}
						>
							<CommentInput postId={post?.id} onComment={(c) => console.log("✅", c)} />

						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default InstagramPost;
