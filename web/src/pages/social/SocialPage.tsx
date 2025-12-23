import { useEffect } from "react";
import { useSocialStore } from "@/stores/useSocialStore";
import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Check, X } from "lucide-react";

const SocialPage = () => {
    const { user } = useUser();
    const { 
        users, 
        friendRequests, 
        isLoading, 
        fetchUsers, 
        fetchFriendRequests, 
        sendFriendRequest, 
        acceptFriendRequest, 
        rejectFriendRequest 
    } = useSocialStore();

    useEffect(() => {
        if (user) {
            fetchUsers();
            fetchFriendRequests();
        }
    }, [fetchUsers, fetchFriendRequests, user]);

    if (isLoading) return <div className="p-6 text-white">Loading...</div>;

    return (
        <div className="p-6 space-y-6 h-full overflow-y-auto custom-scrollbar">
            <h1 className="text-2xl font-bold text-white">Social</h1>

            <Tabs defaultValue="discover" className="w-full">
                <TabsList className="bg-zinc-800 text-zinc-400">
                    <TabsTrigger value="discover">Discover</TabsTrigger>
                    <TabsTrigger value="requests">
                        Requests
                        {friendRequests.length > 0 && (
                            <span className="ml-2 bg-emerald-500 text-white text-xs rounded-full px-2 py-0.5">
                                {friendRequests.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="discover" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {users.map((u) => (
                            <div key={u._id} className="bg-zinc-900 p-4 rounded-lg flex items-center justify-between border border-zinc-800 hover:border-zinc-700 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={u.imageUrl} />
                                        <AvatarFallback>{u.fullName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-white">{u.fullName}</p>
                                    </div>
                                </div>
                                <Button 
                                    size="sm" 
                                    variant="secondary"
                                    onClick={() => sendFriendRequest(u._id)}
                                    className="hover:bg-emerald-500 hover:text-white"
                                >
                                    <UserPlus className="size-4 mr-2" />
                                    Add
                                </Button>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="requests" className="mt-6">
                     {friendRequests.length === 0 ? (
                        <div className="text-center text-zinc-400 py-10">
                            No pending friend requests
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {friendRequests.map((req) => (
                                <div key={req._id} className="bg-zinc-900 p-4 rounded-lg flex items-center justify-between border border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={req.senderId.imageUrl} />
                                            <AvatarFallback>{req.senderId.fullName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-white">{req.senderId.fullName}</p>
                                            <p className="text-xs text-zinc-500">Sent a request</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            size="icon" 
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white h-8 w-8"
                                            onClick={() => acceptFriendRequest(req.senderId._id)}
                                        >
                                            <Check className="size-4" />
                                        </Button>
                                        <Button 
                                            size="icon" 
                                            variant="destructive"
                                            className="h-8 w-8"
                                            onClick={() => rejectFriendRequest(req.senderId._id)}
                                        >
                                            <X className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SocialPage;
