import axios from "axios";
import instance from "../helpers/axios"; // hoặc đường dẫn đến file axios của bạn

// Định nghĩa kiểu dữ liệu cho data
interface RegisterData {
    email: string;
    fullname: string;
    username: string;
    password: string;
}

export const loginTest = async (email: any, password: any) => {
    try {
        const res = await instance.post("/auth/login/", {
            email,
            password,
        });
        return res;
    } catch (err) {
        console.error("❌ Login lỗi", err);
    }
};

export const callRegister = async (data: RegisterData) => {
    return axios.post("/api/auth/register", {
        email: data.email,
        fullName: data.fullname,
        username: data.username,
        password: data.password,
    });
};

export const callLogout = async () => {
    try {
        const res = await instance.post(
            "/auth/logout/",
            {}, // body rỗng
            { withCredentials: true } // cấu hình
        );
        console.log("Đăng xuất thành công:", res);
        return res;
    } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
        throw error; // ném lại lỗi nếu cần xử lý ở component
    }
};

export const getPost = async () => {
    try {
        const res = await instance.get(
            "/posts/",
            { withCredentials: true } // cấu hình
        );
        console.log("get post:", res);
        return res;
    } catch (error) {
        console.error("Lỗi khi getpost:", error);
        throw error; // ném lại lỗi nếu cần xử lý ở component
    }
};

export const getUser = async () => {
    try {
        const res = await instance.get(
            "/users/1",
            { withCredentials: true } // cấu hình
        );
        console.log("get user:", res);
        return res;
    } catch (error) {
        console.error("Lỗi khi get user:", error);
        throw error; // ném lại lỗi nếu cần xử lý ở component
    }
};

export const callInfoUser = (token) => {
    return axios.get("/taikhoan/me", {
        headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
        },
    });
};
