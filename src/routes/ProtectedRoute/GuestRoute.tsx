import { Navigate } from "react-router-dom";

// isAuthenticated: boolean kiểm tra đăng nhập (có thể lấy từ context, redux, localStorage, ...)
export default function GuestRoute({ children }: any) {
	const isAuthenticated = !!localStorage.getItem("isLogin"); // ví dụ check token
	// Nếu đã đăng nhập thì redirect sang trang chủ
	if (isAuthenticated) {
		console.log("isAuthenticatedisAuthenticatedisAuthenticated", isAuthenticated)
		return <Navigate to="/" replace />;
	}

	// Nếu chưa đăng nhập thì cho vào trang login
	return children;
}
