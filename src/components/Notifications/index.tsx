// src/components/NotificationPopup.js
import { useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "../../helpers/socket/index";
import axios from "axios";
import usePostStore from "../../stores/postStore";

export default function Notification() {
	const [notifications, setNotifications] = useState<any>([]);
	const getUserId = () => {
		try {
			const userStorage = localStorage.getItem("user-storage");
			if (!userStorage) return null;
			const parsed = JSON.parse(userStorage);
			return parsed.state?.user?.id || null;
		} catch (err) {
			console.error("Lỗi khi lấy userId từ localStorage:", err);
			return null;
		}
	};


	const doRefresh = usePostStore(state => state.doRefresh);
	const refresh = usePostStore(state => state.refresh);

	const userId = getUserId();

	useEffect(() => {
		if (!userId) return;

		// Kết nối WebSocket
		connectSocket(userId, (data) => {
			doRefresh()
			setNotifications((prev: any) => [data, ...prev]);
		});

		axios.get("http://localhost:8000/api/notifications/", {
			withCredentials: true,
		}).then((res) => {
			setNotifications((prev: any) => {
				// Nếu prev.length === 0 thì user chưa nhận gì => dùng kết quả API
				if (prev.length === 0) return res.data;

				// Nếu có realtime trước đó => gộp thêm vào (tránh trùng bằng ID)
				const existingIds = new Set(prev.map((item: any) => item.id));
				const newNotis = res.data.filter((n: any) => !existingIds.has(n.id));
				return [...prev, ...newNotis];
			});
		});


		return () => {
			disconnectSocket();
		};
	}, [userId, refresh]);
	console.log("notifications", notifications)
	return (
		<div className=" w-[500px] overflow-y-auto">
			{Array.isArray(notifications) && notifications.map((noti, idx) => (
				<div key={noti.id || idx} className="text-black">
					{noti.content}
				</div>
			))}
		</div>
	);
}
