import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { User } from "@/types";
import { AxiosError } from "axios";

interface SocialStore {
    users: User[]; // All users (or potential friends)
    friendRequests: any[]; // Pending requests
    friends: User[]; // My friends
    isLoading: boolean;
    error: string | null;

    fetchUsers: () => Promise<void>;
    fetchFriendRequests: () => Promise<void>;
    sendFriendRequest: (targetUserId: string) => Promise<void>;
    acceptFriendRequest: (requesterId: string) => Promise<void>;
    rejectFriendRequest: (requesterId: string) => Promise<void>;
    followUser: (targetUserId: string) => Promise<void>;
    unfollowUser: (targetUserId: string) => Promise<void>;
}

export const useSocialStore = create<SocialStore>((set) => ({
    users: [],
    friendRequests: [],
    friends: [],
    isLoading: false,
    error: null,

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

    fetchFriendRequests: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/users/requests");
            set({ friendRequests: response.data });
        } catch (error) {
            const message = (error as AxiosError<{ message: string }>).response?.data?.message || "Failed to fetch friend requests";
            set({ error: message });
        } finally {
            set({ isLoading: false });
        }
    },

    sendFriendRequest: async (targetUserId) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.post(`/users/request/${targetUserId}`);
            toast.success("Friend request sent!");
            // Optimistically update UI if needed, or just re-fetch
        } catch (error) {
            const message = (error as AxiosError<{ message: string }>).response?.data?.message || "Failed to send request";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    acceptFriendRequest: async (requesterId) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.post("/users/request/accept", { requesterId });
            toast.success("Friend request accepted!");
            set((state) => ({
                friendRequests: state.friendRequests.filter((req) => req.senderId._id !== requesterId),
                // We might want to add to friends list here, but we'd need the full user object. 
                // For now, let's just remove from requests.
            }));
        } catch (error) {
            const message = (error as AxiosError<{ message: string }>).response?.data?.message || "Failed to accept request";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    rejectFriendRequest: async (requesterId) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.post("/users/request/reject", { requesterId });
            toast.success("Friend request rejected");
            set((state) => ({
                friendRequests: state.friendRequests.filter((req) => req.senderId._id !== requesterId),
            }));
        } catch (error) {
            const message = (error as AxiosError<{ message: string }>).response?.data?.message || "Failed to reject request";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    followUser: async (targetUserId) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.post(`/users/follow/${targetUserId}`);
            toast.success("Followed user!");
        } catch (error) {
            const message = (error as AxiosError<{ message: string }>).response?.data?.message || "Failed to follow user";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    unfollowUser: async (targetUserId) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.post(`/users/unfollow/${targetUserId}`);
            toast.success("Unfollowed user");
        } catch (error) {
            const message = (error as AxiosError<{ message: string }>).response?.data?.message || "Failed to unfollow user";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },
}));
