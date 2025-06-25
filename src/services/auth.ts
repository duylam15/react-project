import instance from "../helpers/axios"; // hoặc đường dẫn đến file axios của bạn

// Định nghĩa kiểu dữ liệu cho data
interface RegisterData {
    email: string;
    fullname: string;
    username: string;
    password: string;
}

export const callLogin = async (email: any, password: any) => {
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
    return instance.post("/auth/register", {
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
            {},
            { withCredentials: true }
        );
        return res;
    } catch (error) {
        throw error;
    }
};
