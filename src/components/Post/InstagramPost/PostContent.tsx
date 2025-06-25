const PostContent = ({ likes, content, user, commentCount, onViewMore }: any) => (
	<div className="pt-3">
		<p className="font-semibold">{likes} lượt thích</p>
		<p>
			<span className="font-semibold">{user?.username}</span> {content}
		</p>
		<p
			className="cursor-pointer text-blue-500 font-semibold"
			onClick={onViewMore}
		>
			Xem thêm {commentCount} bình luận
		</p>
	</div>
);

export default PostContent;