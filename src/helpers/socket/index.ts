// helpers/socket/index.ts
let socket: WebSocket | null = null;

export const connectSocket = (
    userId: number,
    onMessage: (data: any) => void
) => {
    try {
        socket = new WebSocket(`ws://localhost:8000/ws/notify/${userId}/`);
        socket.onopen = () => {
            console.log("✅ WebSocket connected");
        };
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("📩 New message", data);
            onMessage(data);
        };
        socket.onclose = () => {
            console.warn("❌ WebSocket disconnected");
        };
        socket.onerror = (error) => {
            console.error("❌ WebSocket error", error);
        };
    } catch (e) {
        console.error("❌ Failed to connect WebSocket", e);
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.close();
        socket = null;
    }
};
