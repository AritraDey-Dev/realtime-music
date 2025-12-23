import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Loader } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { getToken, userId } = useAuth();
    const [loading, setLoading] = useState(true);
    const { checkAdminStatus } = useAuthStore();
    const { disconnectSocket, initSocket } = useChatStore();

    // Set up Axios interceptor to inject token on every request
    useEffect(() => {
        const interceptorId = axiosInstance.interceptors.request.use(async (config) => {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        return () => {
            axiosInstance.interceptors.request.eject(interceptorId);
        };
    }, [getToken]);

    useEffect(() => {
        const initAuth = async () => {
            try {
                if (userId) {
                    // The interceptor will handle adding the token
                    await checkAdminStatus();
                    initSocket(userId);
                }
            } catch (e) {
                console.error("Error initializing auth", e);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        return () => disconnectSocket();
    }, [userId, checkAdminStatus, initSocket, disconnectSocket]);

    if (loading) {
        return (
            <div className="h-screen w-full justify-center flex items-center">
                <Loader className="size-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return <div>{children}</div>;
};

export default AuthProvider;