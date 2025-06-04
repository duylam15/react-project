import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }: any) {
	// Ví dụ: check token đăng nhập (tùy bạn lưu ở đâu, có thể là context hoặc localStorage)
	const isAuthenticated = localStorage.getItem("isLogin") === "true";

	if (!isAuthenticated) {
		// Chưa đăng nhập, redirect về /login
		return <Navigate to="/login" replace />;
	}

	// Đã đăng nhập, cho vào
	return children;
}
