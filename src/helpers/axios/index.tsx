import axios from "axios";
import { Mutex } from "async-mutex";
import { useAuthStore } from '../../stores/authStore'; // Import trực tiếp hàm set
import { useAuthStore as _useAuthStore } from '../../stores/authStore';
// KHÔNG được gọi hook ở đây, chỉ import store để set state
const mutex = new Mutex();

const baseUrl = "http://localhost:8000/api";

const instance = axios.create({
	baseURL: baseUrl,
	withCredentials: true,
});

const handleRefreshToken = async () => {
	return await mutex.runExclusive(async () => {
		const res = await instance.get('/auth/refresh');
		console.log("res refresh", res)
		if (res && res.data) return res.data.access_token;
		else return null;
	});
}

// Thêm một interceptor cho các yêu cầu
instance.interceptors.request.use(function (config) {
	if (typeof window !== "undefined" && window && window.localStorage && window.localStorage.getItem('access_token')) {
		config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
	}
	return config;
}, function (error) {
	return Promise.reject(error);
});

const NO_RETRY_HEADER = 'x-no-retry';

// Thêm một interceptor cho các phản hồi
instance.interceptors.response.use(function (response) {
	return response && response.data ? response.data : response;
}, async function (error) {

	if (error.config && error.response
		&& +error.response.status === 401 // Kiểm tra lỗi xác thực (401 Unauthorized)
		&& !error.config.headers[NO_RETRY_HEADER] // Kiểm tra xem yêu cầu đã thử lại chưa
	) {
		console.log("Force redirect to /login!", error);

		const access_token = await handleRefreshToken(); // Cố gắng làm mới token
		error.config.headers[NO_RETRY_HEADER] = 'true'; // Đánh dấu yêu cầu này là đã thử lại
		if (access_token) {
			error.config.headers['Authorization'] = `Bearer ${access_token}`; // Cập nhật header Authorization với token mới
			localStorage.setItem('access_token', access_token); // Lưu token mới vào localStorage
			return instance.request(error.config); // Thực hiện lại yêu cầu gốc với token mới
		}
		console.log("Force redirect to /login!", error);

	}
	console.log("Force redirect to /login!", error.response);

	if (
		error.config && error.response
		&& (+error.response.status === 400 || +error.response.status === 401)
		&& error.config.url.endsWith('/auth/refresh')
	) {
		console.log("Force redirect to /login!", error.response);
		if (window.location.pathname !== '/')
			window.location.href = '/login';
	}

	return error?.response?.data ?? Promise.reject(error);
});

export default instance; 
