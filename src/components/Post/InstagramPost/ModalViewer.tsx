import { Modal, Carousel } from "antd";
import {
	FaHeart,
	FaRegHeart,
	FaComment,
	FaPaperPlane,
	FaBookmark,
	FaRegBookmark,
} from "react-icons/fa";
import { IconDots } from "../../UI/icons/ic_dots";
import CommentInput from "../CommentInput/CommentInput";

const ModalViewer = ({
	open,
	onClose,
	mediaList,
	postId,
	liked,
	saved,
	onLike,
	onSave,
	theme,
	t,
}: any) => {
	const iconColor = theme === "dark" ? "white" : "black";
	return (
		<Modal open={open} onCancel={onClose} footer={null} width={"70%"} centered className="model-custom">
			<div className="flex">
				<div className="w-[55%]">
					<Carousel infinite={false} arrows>
						{mediaList.map((media: any) => (
							<img
								key={media.id}
								src={media.media}
								alt=""
								className="w-full h-[90vh] object-cover"
							/>
						))}
					</Carousel>
				</div>

				<div className="w-1/2 flex flex-col justify-between">
					<div className="overflow-y-auto h-[400px]">
						<div className="flex p-5 justify-between items-center gap-3 border-b pb-3">
							<div className="flex items-center gap-3">
								<img
									src="/images/uifaces-popular-image (11).jpg"
									alt="Avatar"
									className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
								/>
								<span className="font-semibold" style={{ color: "var(--text-color)" }}>username</span>
							</div>
							<IconDots color={iconColor} />
						</div>
						{/* Placeholder Comments */}
						<div className="pt-2 pl-5 pr-5 flex flex-col gap-3">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="flex items-center gap-3">
									<img
										src="/images/uifaces-popular-image (11).jpg"
										alt="Avatar"
										className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
									/>
									<div className="flex flex-col items-start">
										<span className="font-semibold" style={{ color: "var(--text-color)" }}>username</span>
										<span className="font-light text-sm" style={{ color: "var(--text-color)" }}>Bình luận ví dụ...</span>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="flex justify-between p-4 pb-0 border-t">
						<div className="flex items-center gap-5">
							<p onClick={onLike} className="text-xl">
								{liked ? <FaHeart className="text-red-500" /> : <FaRegHeart style={{ color: "var(--text-color)" }} />}
							</p>
							<p className="text-xl" style={{ color: "var(--text-color)" }}><FaComment /></p>
							<p className="text-xl"><FaPaperPlane style={{ color: "var(--text-color)" }} /></p>
						</div>
						<p onClick={onSave} className="text-xl">
							{saved ? <FaBookmark style={{ color: "var(--text-color)" }} /> : <FaRegBookmark style={{ color: "var(--text-color)" }} />}
						</p>
					</div>

					<div className="p-4 pt-0">
						<p className="font-semibold text-[16px]" style={{ color: "var(--text-color)" }}>1,234 {t("likes")}</p>
						<p className="font-light" style={{ color: "var(--text-color)" }}>20 {t("hour")}</p>
					</div>

					<div className="pl-5 pr-5 border-t">
						<CommentInput postId={postId} onComment={(c: any) => console.log("✅", c)} />
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ModalViewer;
