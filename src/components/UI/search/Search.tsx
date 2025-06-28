import { useState } from "react";
import { List, Spin } from "antd";
import { LoadingOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { getUsersBySearch } from "../../../services/user";
import { getPostsBySearch } from "../../../services/post";

export default function Search() {
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState([]);
	const [posts, setPosts] = useState([]);

	const { t } = useTranslation();

	const handleSearch = async (value: string) => {
		setQuery(value);
		if (!value) {
			setUsers([]);
			setPosts([]);
			return;
		}

		setLoading(true);
		try {
			const [userRes, postRes]: any = await Promise.all([
				getUsersBySearch(value),
				getPostsBySearch(value),
			]);
			console.log(userRes)
			console.log(postRes?.suggested)

			setUsers(userRes?.results || []);
			setPosts((postRes.results && postRes.results.length > 0)
				? postRes.results
				: (postRes.suggested || []));

		} catch (error) {
			console.error("❌ Lỗi tìm kiếm:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleClear = () => {
		setQuery("");
		setUsers([]);
		setPosts([]);
	};

	console.log("posts", posts)

	return (
		<div className="w-[400px]  relative " style={{ background: "var(--bg-color)" }}>
			<div className="text-[24px] font-medium mt-3 p-3">{t('search')}</div>

			<div className="mt-6 p-3 ">
				<input
					className="custom-input border px-4 py-2 rounded-md focus:outline-none w-full"
					placeholder={t('search')}
					value={query}
					onChange={(e) => handleSearch(e.target.value)}
					style={{ borderColor: "var(--white-to-gray)" }}
				/>
				{loading ? (
					<Spin indicator={<LoadingOutlined
						style={{ fontSize: 18, position: "absolute", right: "12px", bottom: "-5px" }} spin />} size="small" />
				) : query ? (
					<CloseCircleOutlined
						onClick={handleClear}
						style={{ cursor: "pointer", fontSize: 18, position: "absolute", right: "25px", bottom: "24px" }}
					/>
				) : null}
			</div>

			{query && (
				<div className="absolute w-full rounded-md mt-1 z-10 " style={{ background: "var(--bg-color)" }}>
					{loading ? (
						<div className="p-4 text-center">{t('loading')}...</div>
					) : users.length + posts.length > 0 ? (
						<>
							{/* Users */}
							{users.length > 0 && (
								<div className="px-4 pt-2 font-bold text-[14px]">{t('users')}</div>
							)}
							<List
								dataSource={users}
								renderItem={(item: any) => (
									<div key={item.id} className="cursor-pointer hover-effect p-3 flex items-center gap-3">
										<img src={item.avatar} className="w-10 h-10 rounded-full" />
										<div className="flex flex-col items-start justify-center" style={{ color: "var(--text-color)" }}>
											<div className="font-medium text-[15px]">{item.username}</div>
											<div>100k {t('follows')}</div>
										</div>
									</div>
								)}
							/>

							{posts.length > 0 && (
								<>
									<div className="px-4 pt-2 font-bold text-[14px]">{t('posts')}</div>

									<div className="max-h-[300px] overflow-y-auto px-2">
										<List
											dataSource={posts}
											renderItem={(post: any) => (
												<div key={post.id} className="p-3 border-b border-gray-200 hover:bg-gray-50">
													<div className="text-[15px] font-medium" style={{ color: "var(--text-color)" }}>
														{post.content}
													</div>

													{/* Hình ảnh nếu có */}
													{post?.media_list?.length > 0 && (
														<img
															src={post.media_list[0].media}
															alt={`media-${post.id}`}
															className="w-20 h-20 object-cover rounded mt-2"
														/>
													)}

													{/* Thời gian đăng */}
													<div className="text-[12px] text-gray-400 mt-1">
														{new Date(post.created_at).toLocaleString()}
													</div>
												</div>
											)}
										/>
									</div>
								</>
							)}

						</>
					) : (
						<p className="p-2 flex text-center items-center justify-center mt-4 text-gray-500">{t('no_results_found')}a</p>
					)}
				</div>
			)}
		</div>
	);
}
