import { axiosInstance } from '@/lib/axios';
import {create} from 'zustand';
import { AxiosError } from 'axios';

interface AuthStore {
    isAdmin: boolean;
    isLoading: boolean;
    error: string | null;
    checkAdminStatus: ()=>Promise<void>;
    reset:()=>void;

}

export const useAuthStore = create<AuthStore>((set) => ({
    isAdmin: false,
    isLoading: false,
    error: null,
    checkAdminStatus: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/admin/check')
            console.log(response.data);
            set({ isAdmin: response.data });
        } catch (error) {
            const message = (error as AxiosError<{ message: string }>).response?.data?.message || "Failed to check admin status";
            set({ error: message, isAdmin: false});
        }
        finally {
            set({ isLoading: false });
        }
    },
    reset: () => set({ isAdmin: false, isLoading: false, error: null }),

})
)