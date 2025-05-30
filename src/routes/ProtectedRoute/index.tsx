import { Navigate, useLocation } from "react-router-dom";
import useUserStore from "../../stores/useUserStore";
import NotPermitted from "./NotPermitted";

const RoleBaseRoute = ({ children }: { children: React.ReactNode }) => {
    const user = useUserStore((state: any) => state?.user);
    const location = useLocation();
    const isAdminRoute = location.pathname?.startsWith("/admin");
    console.log("useruseruser ", user)
    if (!user) return <NotPermitted />;

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
    const isLogin = localStorage.getItem("isLogin")
    return isLogin == "true" ? (
        <RoleBaseRoute>{children}</RoleBaseRoute>
    ) : (
        <Navigate to="/login" replace />
    );
};

export default ProtectedRoute;
