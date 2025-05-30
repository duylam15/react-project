import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notification } from "antd";
import { loginTest } from "../../services/auth";
import { FaFacebook } from "react-icons/fa";
import "./login.css";
import useUserStore from "../../stores/useUserStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Truy cập state & action từ zustand
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  // ✅ Hiển thị user khi thay đổi (sẽ được gọi sau khi setUser)
  useEffect(() => {
    console.log("👤 User đã cập nhật:", user);
  }, [user]);

  // ✅ Xử lý thay đổi input
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
  };

  // ✅ Xử lý đăng nhập
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res: any = await loginTest(email, password);
      console.log("📦 Dữ liệu trả về:", res.user.role);

      if (res?.user) {
        setUser(res.user); // ✅ Cập nhật zustand store
        notification.success({
          message: "Đăng nhập thành công!",
          duration: 3,
        });
        localStorage.setItem("isLogin", "true")
        if (res?.user?.role === "ADMIN")
          navigate("/admin");
        else navigate("/");
      } else {
        throw new Error("Thông tin đăng nhập không hợp lệ");
      }
    } catch (error: any) {
      notification.error({
        message: "Đăng nhập thất bại",
        description: error?.message || "Lỗi không xác định",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Cột trái */}
      <div className="hidden lg:flex w-1/2 justify-center">
        <img src="/images/instagram-mockup.png" alt="Instagram mockup" className="h-[550px]" />
      </div>

      {/* Cột phải */}
      <div className="flex flex-col items-center w-[350px] bg-white p-8 rounded-lg shadow-md border border-gray-300">
        <div className="flex justify-center mb-6">
          <img src="/images/Instagram-Logo.png" alt="Instagram Logo" className="h-25 w-auto" />
        </div>

        <form onSubmit={handleLogin} className="flex flex-col w-full">
          <div className="mb-2">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className={`p-2 border rounded-md text-sm w-full ${errors.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:border-black`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="mb-2">
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={handlePasswordChange}
              className={`p-2 border rounded-md text-sm w-full ${errors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:border-black`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button type="submit" className="button-submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="flex items-center my-3">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-2 text-gray-500 text-sm font-semibold">HOẶC</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          className="flex btn_facebook items-center justify-center font-semibold p-2 rounded-lg hover:text-blue-800 transition duration-300 bg-transparent"
          style={{ background: "none" }}
        >
          <FaFacebook style={{ fontSize: "20px", color: "rgb(76,181,249)", marginRight: 8 }} />
          Đăng nhập bằng Facebook
        </button>

        <Link to="/forgotpassword" className="text-black-500 text-sm text-center mt-2">
          Quên mật khẩu?
        </Link>

        <div className="border border-gray-300 w-full text-center text-sm mt-5 p-3 rounded-md">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-500 font-semibold">
            Đăng ký
          </Link>
        </div>
        <div className="text-red-800">xxxxx</div>
        {/* ✅ Hiển thị user nếu có */}
        {user && (
          <div className="mt-4 text-sm text-green-600">
            <p>👋 Xin chào, <strong>{user.username}</strong>!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
