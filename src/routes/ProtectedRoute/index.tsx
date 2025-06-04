import { Navigate, useLocation } from "react-router-dom";
import useUserStore from "../../stores/useUserStore";
import NotPermitted from "./NotPermitted";

const RoleBaseRoute = ({ children }: { children: React.ReactNode }) => {
    const user = useUserStore((state: any) => state?.user);
    const location = useLocation();
    const isAdminRoute = location.pathname?.startsWith("/admin");

    // Trường hợp chưa lấy được user (null hoặc undefined) --> có thể show loading chứ KHÔNG show NotPermitted
    if (user === undefined) return <div>Loading...</div>; // hoặc <div>Loading...</div>

    if (!user) return <Navigate to="/login" replace />; // Nếu không đăng nhập, về login

    const userRole = user?.role;

    if (
        (isAdminRoute && userRole === "ADMIN") ||
        (!isAdminRoute && (userRole === "USER" || userRole === "ADMIN"))
    ) {
        return <>{children}</>;
    } else {
        return <NotPermitted />;
    }
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    // Không render gì nếu chưa biết trạng thái đăng nhập (tránh lóe giao diện)
    const isAuthenticated = !!localStorage.getItem("isLogin"); // ví dụ check token

    if (isAuthenticated) {
        return <RoleBaseRoute>{children}</RoleBaseRoute>;
    } else {
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
