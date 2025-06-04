import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { notification } from "antd";
import { loginTest } from "../../services/auth";
import { FaFacebook } from "react-icons/fa";
import "./login.css";
import useUserStore from "../../stores/useUserStore";

type LoginForm = {
  username: string;
  password: string;
};

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LoginForm>();
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const onSubmit = async (data: LoginForm) => {
    const res: any = await loginTest(data.username, data.password);
    console.log(res)
    if (res?.status === 200 && res?.user) {
      setUser(res.user);
      localStorage.setItem("isLogin", "true");
      notification.success({ message: "Đăng nhập thành công!", duration: 3 });
      navigate(res.user.role === "ADMIN" ? "/admin" : "/");
    } else {
      notification.error({
        message: "Đăng nhập thất bại!",
        description: res?.detail || "Lỗi không xác định",
        duration: 3,
      });
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full"
          autoComplete="off"
        >
          <div className="mb-2">
            <input
              type="text"
              placeholder="Tên tài khoản"
              {...register("username", {
                required: "Vui lòng nhập tên tài khoản",
                minLength: {
                  value: 3,
                  message: "Tên tài khoản phải từ 3 ký tự"
                }
              })}
              className={`p-2 border rounded-md text-sm w-full ${errors.username ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:border-black`}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>
          <div className="mb-2">
            <input
              type="password"
              placeholder="Mật khẩu"
              {...register("password", {
                required: "Vui lòng nhập mật khẩu",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải từ 6 ký tự"
                }
              })}
              className={`p-2 border rounded-md text-sm w-full ${errors.password ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:border-black`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" className="button-submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
        <div className="flex items-center my-3 w-full">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-2 text-gray-500 text-sm font-semibold">HOẶC</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <button
          className="flex btn_facebook items-center justify-center font-semibold p-2 rounded-lg hover:text-blue-800 transition duration-300 bg-transparent"
          style={{ background: "none" }}
          type="button"
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
      </div>
    </div>
  );
};

export default Login;
