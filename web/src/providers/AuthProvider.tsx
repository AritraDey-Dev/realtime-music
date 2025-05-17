import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Loader } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";

const updateApiToken = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
}

const AuthProvider = ({ children }:{children:React.ReactNode}) => {
    const { getToken,userId } = useAuth();
    const [loading, setLoading] = useState(true);
    const {checkAdminStatus} = useAuthStore();
    const { disconnectSocket, initSocket } = useChatStore()
    
    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await getToken();
                updateApiToken(token);
                if(token){
                    await checkAdminStatus();
                    if (userId) initSocket(userId);
                }

            } catch (e) {
                updateApiToken(null);
                console.error("Error fetching token", e);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
        return () => disconnectSocket();
    }, [getToken, userId, checkAdminStatus, disconnectSocket, initSocket]);

if (loading) {
    return <div className="h-screen w-full justify-center flex items-center">
        <Loader  className="size-8 text-emerald-500 animate-spin"/>
    </div>;
}
    return (
        <div>
        {children}
        </div>
    );

}

export default AuthProvider;