import React, { useEffect, useState } from 'react';
import { Table, Image, Tag, Carousel } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import axios from 'axios';
import moment from 'moment';

interface Media {
	id: number;
	media: string;
}

interface Post {
	id: number;
	content: string;
	created_at: string;
	media_list: Media[];
	user: number;
	type_post: 'TEXT' | 'IMAGE' | 'VIDEO';
	visibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
	number_emotion: number;
	number_comment: number;
	number_share: number;
}

export default function AdminPostPage() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [pagination, setPagination] = useState<TablePaginationConfig>({
		current: 1,
		pageSize: 5,
		total: 0,
	});
	const [loading, setLoading] = useState(false);

	const fetchPosts = async (page: number, pageSize: number) => {
		setLoading(true);
		const offset = (page - 1) * pageSize;
		try {
			const res: any = await axios.get(
				`http://localhost:8000/api/posts/?limit=${pageSize}&offset=${offset}`,
				{ withCredentials: true }
			);
			setPosts(res.data.results);
			setPagination((prev) => ({
				...prev,
				current: page,
				pageSize,
				total: res.data.count,
			}));
		} catch (err) {
			console.error("Lỗi khi tải bài viết:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPosts(1, pagination.pageSize || 5);
	}, []);

	const handleTableChange = (pagination: TablePaginationConfig) => {
		fetchPosts(pagination.current || 1, pagination.pageSize || 5);
	};

	const handleEditPost = (post: Post) => {
		alert(`Chỉnh sửa post: ${post.id}`);
	};

	const handleDeletePost = async (id: number) => {
		if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;
		try {
			await axios.delete(`http://localhost:8000/api/posts/${id}/`, {
				withCredentials: true,
			});
			fetchPosts(pagination.current || 1, pagination.pageSize || 5);
		} catch (err) {
			console.error("Xóa bài viết thất bại:", err);
		}
	};

	const columns: ColumnsType<Post> = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: 60,
		},
		{
			title: 'Ảnh',
			key: 'media',
			render: (_, record) => (
				record.media_list?.length ? (
					<Carousel autoplay dots={false} className="w-[120px] h-[80px]">
						{record.media_list.map((m) => (
							<div key={m.id}>
								<Image
									src={m.media}
									width={120}
									height={80}
									style={{ objectFit: 'cover' }}
								/>
							</div>
						))}
					</Carousel>
				) : <span>—</span>
			),
		},
		{
			title: 'Nội dung',
			dataIndex: 'content',
			key: 'content',
		},
		{
			title: 'Loại',
			dataIndex: 'type_post',
			key: 'type_post',
			render: (type) => (
				<Tag color={type === 'IMAGE' ? 'blue' : type === 'VIDEO' ? 'red' : 'green'}>
					{type}
				</Tag>
			),
		},
		{
			title: 'Chế độ',
			dataIndex: 'visibility',
			key: 'visibility',
			render: (vis) => (
				<Tag color={vis === 'PUBLIC' ? 'green' : vis === 'FRIENDS' ? 'orange' : 'gray'}>
					{vis}
				</Tag>
			),
		},
		{
			title: 'Cảm xúc',
			dataIndex: 'number_emotion',
			key: 'number_emotion',
		},
		{
			title: 'Bình luận',
			dataIndex: 'number_comment',
			key: 'number_comment',
		},
		{
			title: 'Chia sẻ',
			dataIndex: 'number_share',
			key: 'number_share',
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'created_at',
			key: 'created_at',
			render: (created_at) => moment(created_at).format("DD/MM/YYYY HH:mm"),
		},
		{
			title: 'Hành động',
			key: 'actions',
			render: (_, record) => (
				<div className="flex gap-2">
					<button
						onClick={() => handleEditPost(record)}
						className="text-blue-500 hover:underline"
					>
						Sửa
					</button>
					<button
						onClick={() => handleDeletePost(record.id)}
						className="text-red-500 hover:underline"
					>
						Xóa
					</button>
				</div>
			),
		},
	];

	return (
		<div>
			<h2 className="text-xl font-bold mb-4">📝 Quản lý bài viết</h2>
			<Table
				rowKey="id"
				columns={columns}
				dataSource={posts}
				loading={loading}
				pagination={pagination}
				onChange={handleTableChange}
				bordered
			/>
		</div>
	);
}
