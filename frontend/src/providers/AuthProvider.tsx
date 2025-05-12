import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Loader } from "lucide-react";

const updateApiToken = (token: string | null) => {
    // Update the API client with the new token
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
}

const AuthProvider = ({ children }:{children:React.ReactNode}) => {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await getToken();
                updateApiToken(token);

            } catch (e) {
                updateApiToken(null);
                console.error("Error fetching token", e);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, [getToken]);

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