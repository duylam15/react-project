import React, { useEffect, useState } from 'react';
import { Table, Avatar } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import axios from 'axios';

interface User {
	id: number;
	username: string;
	email: string;
	phone_number: string;
	avatar_url: string | null;
	is_active: boolean;
	is_online: boolean;
	role: string;
}

export default function AdminUserPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [pagination, setPagination] = useState<TablePaginationConfig>({
		current: 1,
		pageSize: 5,
		total: 0,
	});
	const [loading, setLoading] = useState(false);

	const fetchUsers = async (page: number, pageSize: number) => {
		setLoading(true);
		const offset = (page - 1) * pageSize;
		try {
			const res: any = await axios.get(
				`http://localhost:8000/api/users/?limit=${pageSize}&offset=${offset}`,
				{ withCredentials: true }
			);
			setUsers(res.data.results);

			// ✅ Cập nhật `total`, nhưng giữ lại `current`, `pageSize`
			setPagination((prev) => ({
				...prev,
				total: res.data.count,
			}));
		} catch (err) {
			console.error("Lỗi khi tải người dùng:", err);
		} finally {
			setLoading(false);
		}
	};


	useEffect(() => {
		fetchUsers(1, pagination.pageSize || 5);
	}, []);

	const handleTableChange = (paginationConfig: TablePaginationConfig) => {
		const current = paginationConfig.current || 1;
		const pageSize = paginationConfig.pageSize || 5;

		setPagination((prev) => ({
			...prev,
			current,
			pageSize,
		}));

		fetchUsers(current, pageSize);
	};


	const handleEditUser = (user: User) => {
		// TODO: mở modal hoặc navigate đến trang sửa user
		alert(`Chỉnh sửa user: ${user.username}`);
	};

	const handleDeleteUser = async (id: number) => {
		if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;

		try {
			await axios.delete(`http://localhost:8000/api/users/${id}/`, {
				withCredentials: true,
			});
			// Xóa xong → reload lại danh sách
			fetchUsers(pagination.current || 1, pagination.pageSize || 5);
		} catch (err) {
			console.error("Lỗi khi xóa người dùng:", err);
			alert("Xóa người dùng thất bại.");
		}
	};

	console.log(users)

	const columns: ColumnsType<User> = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: 60,
		},
		{
			title: 'Username',
			dataIndex: 'username',
			key: 'username',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'phone_number',
			key: 'phone_number',
		},
		{
			title: 'Avatar',
			dataIndex: 'avatar_url',
			key: 'avatar_url',
			render: (url) => (url ? <Avatar src={url} /> : <Avatar icon="👤" />),
		},
		{
			title: 'Vai trò',
			dataIndex: 'role',
			key: 'role',
		},
		{
			title: 'Trạng thái',
			key: 'status',
			render: (_, record) => (
				<span style={{ color: record.is_online ? 'green' : 'gray' }}>
					{record.is_online ? 'Online' : 'Offline'}
				</span>
			),
		},
		{
			title: 'Hành động',
			key: 'actions',
			render: (_, record) => (
				<div className="flex gap-2">
					<button
						onClick={() => handleEditUser(record)}
						className="text-blue-500 hover:underline"
					>
						Sửa
					</button>
					<button
						onClick={() => handleDeleteUser(record.id)}
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
			<h2 className="text-xl font-bold mb-4">👤 Quản lý người dùng</h2>
			<Table
				rowKey="id"
				columns={columns}
				dataSource={users}
				loading={loading}
				pagination={pagination}
				onChange={handleTableChange}
				bordered
			/>
		</div>
	);
}
