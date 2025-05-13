import { axiosInstance } from '@/lib/axios';
import { create } from 'zustand';

interface ChatStore {
    users: any[];
    fetchUsers: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
}
export const useChatStore = create<ChatStore>((set) => ({
    users: [],
    isLoading: false,
    error: null,
    fetchUsers: async () => {
        set({ error: null, isLoading: true });
        try {
            const response = await axiosInstance.get('/users');
            set({ users: response.data });
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            set({ isLoading: false });
        }
    },
}));