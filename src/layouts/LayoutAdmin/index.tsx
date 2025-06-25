import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { callLogout } from '../../services/auth';

export default function LayoutAdmin() {
	const [username, setUsername] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const userStorage = localStorage.getItem("user-storage");
		if (userStorage) {
			try {
				const parsed = JSON.parse(userStorage);
				const user = parsed?.state?.user;
				if (user?.username) setUsername(user.username);
			} catch (err) {
				console.error("Lỗi đọc user từ localStorage:", err);
			}
		}
	}, []);

	const handleLogout = () => {
		callLogout()
		setUsername(null);
		localStorage.removeItem("isLogin");
		navigate("/login");
	};

	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<header className="flex justify-between items-center bg-pink-100 p-4 border-b border-gray-300">
				<h1 className="text-lg font-semibold text-pink-600">Admin Panel</h1>
				<div className="flex items-center gap-4">
					<span className="text-gray-700">👤 {username}</span>
					<button
						onClick={handleLogout}
						className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-1 rounded"
					>
						Đăng xuất
					</button>
				</div>
			</header>

			{/* Main layout */}
			<div className="flex flex-1">
				{/* Sidebar */}
				<aside className="w-64 bg-gray-100 p-4 border-r border-gray-200">
					<h2 className="text-xl font-bold mb-4">Admin</h2>
					<nav className="flex flex-col gap-2">
						<NavLink to="/admin" end>Dashboard</NavLink>
						<NavLink to="/admin/posts">Posts</NavLink>
						<NavLink to="/admin/users">Users</NavLink>
					</nav>
				</aside>

				{/* Main content */}
				<main className="flex-1 p-6 bg-white">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
