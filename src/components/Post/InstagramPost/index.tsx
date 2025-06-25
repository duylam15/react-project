import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useTheme } from "@emotion/react";
import { useTranslation } from "react-i18next";
import { Post } from "../../../types/posts";
import { User } from "../../../types/user";
import usePostStore from "../../../stores/postStore";
import { getUser } from "../../../services/user";
import { deletePost } from "../../../services/post";
import Header from "./Header";
import ImageCarousel from "./ImageCarousel";
import ActionButtons from "./ActionButtons";
import PostContent from "./PostContent";
import CommentInput from "../CommentInput/CommentInput";
import ModalViewer from "./ModalViewer";
import EditBox from "../EditBox";

type Props = {
	post: Post;
	first?: string;
};

const InstagramPost = ({ post, first }: Props) => {
	const [liked, setLiked] = useState(false);
	const [saved, setSaved] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [user, setUser] = useState<User>();
	const theme: any = useTheme();

	const { t } = useTranslation();
	const doRefresh = usePostStore(state => state.doRefresh);

	useEffect(() => {
		if (post.user) {
			getUser(post.user).then((res) => setUser(res.data));
		}
	}, [post.user]);

	const handleDeletePost = async (id: number) => {
		try {
			await deletePost(id);
			doRefresh();
		} catch {
			console.error("Failed to delete post.");
		}
	};

	return (
		<div className={`max-w-[470px] h-[900px] var(--bg-color) pt-2 ${first ? "" : "border-t border-gray-600"}`}>
			<Header
				user={user}
				time={post.created_at}
				onEdit={() => setShowEdit(true)}
				onDelete={() => handleDeletePost(post.id)}
				theme={theme}
			/>

			{showEdit && (
				<EditBox
					postId={post.id}
					content={post.content}
					typePost={post.type_post}
					mediaList={post.media_list}
					onClose={() => setShowEdit(false)}
				/>
			)}

			<ImageCarousel mediaList={post.media_list} />

			<ActionButtons liked={liked} saved={saved} onLike={() => setLiked(!liked)} onSave={() => setSaved(!saved)} />

			<PostContent
				likes={post.number_emotion}
				content={post.content}
				user={user}
				commentCount={post.number_comment}
				onViewMore={() => setIsModalOpen(true)}
			/>

			<CommentInput postId={post.id} onComment={(c: any) => console.log("New comment:", c)} />

			<ModalViewer
				open={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				mediaList={post.media_list}
				postId={post.id}
				liked={liked}
				saved={saved}
				onLike={() => setLiked(!liked)}
				onSave={() => setSaved(!saved)}
				theme={theme}
				t={t}
			/>
		</div>
	);
};

export default InstagramPost;
