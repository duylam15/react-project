import axios from "axios";
import { Mutex } from "async-mutex";
const mutex = new Mutex();

const baseUrl = "http://localhost:8000/api";

const instance = axios.create({
	baseURL: baseUrl,
	withCredentials: true,
});


const handleRefreshToken = async () => {
	// console.log("🔁 Đang gọi refresh token (cookie-based)...");
	return await mutex.runExclusive(async () => {
		try {
			const res = await instance.post(
				'/auth/refresh/',   // endpoint cần đúng là POST
				{},                 // body rỗng, hoặc tuỳ backend
				{ withCredentials: true } // QUAN TRỌNG! để cookie gửi lên backend
			);
			// console.log("res refresh", res);
			if (res && res.data) return res.data.access_token;
			// else console.log("res xada");
		} catch (err) {
			// console.log("❌ Refresh token fail", err);
			return null;
		}
	});
};

// LOG ở interceptor REQUEST
instance.interceptors.request.use(function (config) {
	// console.log("➡️ [Request] URL:", config.url, "headers:", config.headers);
	if (typeof window !== "undefined" && window && window.localStorage && window.localStorage.getItem('access_token')) {
		config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
	}
	return config;
}, function (error) {
	// console.log("❌ [Request Error]", error);
	return Promise.reject(error);
});

const NO_RETRY_HEADER = 'x-no-retry';

// LOG ở interceptor RESPONSE (success và error)
instance.interceptors.response.use(
	function (response) {
		// console.log("⬅️ [Response OK]", response.config?.url, "status:", response.status);
		return response && response.data ? response.data : response;
	},
	async function (error) {
		// console.log("🔥 [Axios Error Interceptor]", error);
		if (
			error.config &&
			error.response &&
			+error.response.status === 401 &&
			!error.config.headers[NO_RETRY_HEADER]
		) {
			// console.log("🔐 401 detected, sẽ thử refresh token...");
			error.config.headers[NO_RETRY_HEADER] = 'true';
			try {
				const access_token = await handleRefreshToken();
				if (access_token) {
					error.config.headers['Authorization'] = `Bearer ${access_token}`;
					localStorage.setItem('access_token', access_token);
					// console.log("✅ Gọi lại request cũ với token mới");
					return instance.request(error.config);
				}
				// console.log("⚠️ Refresh token fail, redirect login");
			} catch (err) {
				// console.log("❌ Refresh token error:", err);
				// console.log("⚠️ Refresh token fail, redirect login");
				window.location.href = '/login';
			}
			return Promise.reject(error);
		}
		// console.log("❌ [Response Error]", error.response);
		window.location.href = '/login';
		return Promise.reject(error);
	}
);


export default instance;
