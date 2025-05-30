import { axiosInstance } from '@/lib/axios';
import {create} from 'zustand';

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
        } catch (error:any) {
            set({ error: error.response.data.message,isAdmin: false});
        }
        finally {
            set({ isLoading: false });
        }
    },
    reset: () => set({ isAdmin: false, isLoading: false, error: null }),

})
)