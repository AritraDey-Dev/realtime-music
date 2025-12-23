import { axiosInstance } from '@/lib/axios';
import { Message, User } from '@/types';
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { AxiosError } from 'axios';

interface ChatStore {
    users: User[];
    socket: Socket | null;
    isConnected: boolean;
    onlineUsers: Set<string>;
    userActivities: Map<string, string>;
    messages: Message[];
    selectedUser: User | null;
    currentUserId: string | null;

    fetchUsers: () => Promise<void>;
    initSocket: (userId: string) => void;
    disconnectSocket: () => void;
    sendMessage: (receiverId: string, senderId: string, content: string) => void;
    fetchMessages: (userId: string) => Promise<void>;
    updateActivity: (activity: string) => void;
    isLoading: boolean;
    setSelectedUser: (user: User | null) => void;
    error: string | null;
}

const baseURL = "http://localhost:3000";

const socket = io(baseURL, {
	autoConnect: false,
	withCredentials: true,
});

export const useChatStore = create<ChatStore>((set,get) => ({
    users: [],
	isLoading: false,
	error: null,
	socket: socket,
	isConnected: false,
	onlineUsers: new Set(),
	userActivities: new Map(),
	messages: [],
	selectedUser: null,
    currentUserId: null,

	setSelectedUser: (user) => set({ selectedUser: user }),

	fetchUsers: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/users");
			set({ users: response.data.users });
		} catch (error) {
			const message = (error as AxiosError<{ message: string }>).response?.data?.message || "Failed to fetch users";
			set({ error: message });
		} finally {
			set({ isLoading: false });
		}
	},

	initSocket: (userId) => {
		console.log("Initializing socket");
        set({ currentUserId: userId });
		if (!get().isConnected) {
			socket.auth = { userId };
			socket.connect();

			socket.emit("user_connected", userId);

			socket.on("users_online", (users: string[]) => {
				set({ onlineUsers: new Set(users) });
			});

			socket.on("activities", (activities: [string, string][]) => {
				set({ userActivities: new Map(activities) });
			});

			socket.on("user_connected", (userId: string) => {
				set((state) => ({
					onlineUsers: new Set([...state.onlineUsers, userId]),
				}));
			});
                               
			socket.on("user_disconnected", (userId: string) => {
				set((state) => {
					const newOnlineUsers = new Set(state.onlineUsers);
					newOnlineUsers.delete(userId);
					return { onlineUsers: newOnlineUsers };
				});
			});

			socket.on("receive_message", (message: Message) => {
				set((state) => ({
					messages: [...state.messages, message],
				}));
			});

			socket.on("message_sent", (message: Message) => {
				set((state) => ({
					messages: [...state.messages, message],
				}));
			});

			socket.on("activity_updated", ({ userId, activity }) => {
				set((state) => {
					const newActivities = new Map(state.userActivities);
					newActivities.set(userId, activity);
					return { userActivities: newActivities };
				});
			});

			set({ isConnected: true });
		}
	},

	disconnectSocket: () => {
		if (get().isConnected) {
			socket.disconnect();
			set({ isConnected: false });
		}
	},

	sendMessage: async (receiverId, senderId, content) => {
		const socket = get().socket;
		if (!socket) return;

		socket.emit("send_message", { receiverId, senderId, content });
	},

	fetchMessages: async (userId: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/users/messages/${userId}`);
			set({ messages: response.data });
		} catch (error) {
			const message = (error as AxiosError<{ message: string }>).response?.data?.message || "Failed to fetch messages";
			set({ error: message });
		} finally {
			set({ isLoading: false });
		}
	},
    updateActivity: (activity: string) => {
        const socket = get().socket;
        if (!socket) return;
        // We need the current user's ID. 
        // Since we don't store it explicitly in the store yet, let's assume the backend can identify the user by socket.id if we don't send userId, 
        // OR we should store userId in initSocket.
        // Let's add userId to the store state.
        const userId = get().currentUserId;
        if (userId) {
            socket.emit("update_activity", { userId, activity });
        }
    },
}));