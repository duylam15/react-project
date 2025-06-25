import {
	FaHeart,
	FaRegHeart,
	FaComment,
	FaPaperPlane,
	FaBookmark,
	FaRegBookmark,
} from "react-icons/fa";

const ActionButtons = ({ liked, saved, onLike, onSave }: any) => (
	<div className="flex justify-between pt-4">
		<div className="flex items-center gap-5">
			<p onClick={onLike} className="text-xl">
				{liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
			</p>
			<p className="text-xl">
				<FaComment />
			</p>
			<p className="text-xl">
				<FaPaperPlane />
			</p>
		</div>
		<p onClick={onSave} className="text-xl">
			{saved ? <FaBookmark /> : <FaRegBookmark />}
		</p>
	</div>
);

export default ActionButtons;