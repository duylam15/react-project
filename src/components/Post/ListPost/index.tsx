import { useEffect, useRef, useState } from "react";
import "./index.css";
import InstagramPost from "../InstagramPost";
import usePostStore from "../../../stores/postStore";
import { Post } from "../../../types/posts";
import { getPost } from "../../../services/post";

const INIT_LIMIT = 5; // Số post mỗi lần load thêm

const ListPost = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [nextUrl, setNextUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const triggerRef = useRef<HTMLDivElement | null>(null);
	const refresh = usePostStore(state => state.refresh);

	// Khi refresh, fetch lại toàn bộ từ đầu tới số lượng post hiện tại (nếu chưa có thì lấy 5)
	useEffect(() => {
		const fetchAllPosts = async () => {
			setLoading(true);
			try {
				const totalLimit = posts.length > 0 ? posts.length : INIT_LIMIT;
				const url = `/posts/?limit=${totalLimit}`;
				const res: any = await getPost(url);
				setPosts(res.results);
				setNextUrl(res.next);
			} catch (err) {
				// xử lý lỗi nếu cần
			} finally {
				setLoading(false);
			}
		};
		fetchAllPosts();
		// eslint-disable-next-line
	}, [refresh]);

	// Fetch thêm khi kéo xuống
	const fetchMorePosts = async (url: string) => {
		setLoading(true);
		try {
			const res: any = await getPost(url);
			setPosts(prev => [...prev, ...res.results]);
			setNextUrl(res.next);
		} catch (err) {
			// xử lý lỗi nếu cần
		} finally {
			setLoading(false);
		}
	};

	// Observer để load thêm bài
	useEffect(() => {
		if (!nextUrl) return;
		const node = triggerRef.current;
		if (!node) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !loading) {
					fetchMorePosts(nextUrl);
				}
			},
			{ root: null, rootMargin: "0px", threshold: 0.5 }
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, [posts, nextUrl, loading]);

	// Tìm index để đặt ref (vẫn dùng INIT_LIMIT)
	return (
		<div className="list-post ml-22 mt-[-10px]">
			{posts.map((post, idx) => {
				const triggerIndex = posts.length - (INIT_LIMIT - 2);
				if (idx === triggerIndex && nextUrl) {
					return (
						<div ref={triggerRef} key={post.id}>
							<InstagramPost post={post} first={idx === 0 ? "first" : undefined} />
						</div>
					);
				}
				return (
					<InstagramPost
						key={post.id}
						post={post}
						first={idx === 0 ? "first" : undefined}
					/>
				);
			})}
			{loading && <div className="text-center py-4">Đang tải...</div>}
		</div>
	);
};

export default ListPost;
