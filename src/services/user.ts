import instance from "../helpers/axios";

// Lấy tất cả user
export const getAllUsers = async () => {
    try {
        const res = await instance.get("/users/", {
            withCredentials: true,
        });
        // console.log("res getAllUsers", res);
        return res;
    } catch (error) {
        console.error("Lỗi khi get user:", error);
        throw error;
    }
};

// Lấy user theo id
export const getUser = async (id: number) => {
    try {
        const res = await instance.get(`/users/${id}`, {
            withCredentials: true,
        });
        // console.log("res getUser", res);
        return res;
    } catch (error) {
        console.error("Lỗi khi get user:", error);
        throw error;
    }
};

// Tạo mới user
export const createUser = async (userData: any) => {
    try {
        const res = await instance.post("/users/", userData, {
            withCredentials: true,
        });
        // console.log(res);
        return res;
    } catch (error) {
        console.error("Lỗi khi tạo user:", error);
        throw error;
    }
};

// Sửa user (update)
export const updateUser = async (id: string, userData: any) => {
    try {
        const formData = new FormData();

        // Thêm các trường thông thường
        for (const key in userData) {
            if (
                userData.hasOwnProperty(key) &&
                userData[key] !== undefined &&
                userData[key] !== null
            ) {
                formData.append(key, userData[key]);
            }
        }

        const res = await instance.patch(`/users/${id}/`, formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        // console.log(res);
        return res;
    } catch (error) {
        console.error("Lỗi khi cập nhật user:", error);
        throw error;
    }
};

// Xóa user
export const deleteUser = async (id: string) => {
    try {
        const res = await instance.delete(`/users/${id}/`, {
            withCredentials: true,
        });
        // console.log(res);
        return res;
    } catch (error) {
        console.error("Lỗi khi xóa user:", error);
        throw error;
    }
};
