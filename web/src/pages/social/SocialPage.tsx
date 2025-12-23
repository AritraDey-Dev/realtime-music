import { useEffect } from "react";
import { useSocialStore } from "@/stores/useSocialStore";
import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Check, X, Users, Mail } from "lucide-react";

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

    if (isLoading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
        </div>
    );

    return (
        <div className="p-6 space-y-8 h-full overflow-y-auto custom-scrollbar bg-gradient-to-b from-zinc-900 via-zinc-900 to-black">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                    Social Hub
                </h1>
                <p className="text-zinc-400">Connect with friends and share your musical journey.</p>
            </div>

            <Tabs defaultValue="discover" className="w-full space-y-6">
                <TabsList className="bg-zinc-800/50 border border-zinc-800 p-1 rounded-lg w-full max-w-md">
                    <TabsTrigger 
                        value="discover" 
                        className="flex-1 data-[state=active]:bg-zinc-700 data-[state=active]:text-white transition-all"
                    >
                        <Users className="mr-2 size-4" />
                        Discover
                    </TabsTrigger>
                    <TabsTrigger 
                        value="requests" 
                        className="flex-1 data-[state=active]:bg-zinc-700 data-[state=active]:text-white transition-all relative"
                    >
                        <Mail className="mr-2 size-4" />
                        Requests
                        {friendRequests.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                                {friendRequests.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="discover" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {users.map((u) => (
                            <Card key={u._id} className="bg-zinc-900/50 border-zinc-800 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 group">
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <Avatar className="size-12 border-2 border-zinc-700 group-hover:border-emerald-500 transition-colors">
                                        <AvatarImage src={u.imageUrl} />
                                        <AvatarFallback>{u.fullName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <CardTitle className="text-lg text-white group-hover:text-emerald-400 transition-colors">
                                            {u.fullName}
                                        </CardTitle>
                                        <CardDescription className="text-xs">Music Lover</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <Button 
                                        className="w-full bg-zinc-800 hover:bg-emerald-600 text-white transition-all duration-300"
                                        onClick={() => sendFriendRequest(u._id)}
                                    >
                                        <UserPlus className="size-4 mr-2" />
                                        Connect
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="requests" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                     {friendRequests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-4">
                            <Mail className="size-16 opacity-20" />
                            <p>No pending friend requests</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {friendRequests.map((req) => (
                                <Card key={req._id} className="bg-zinc-900/50 border-zinc-800">
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <Avatar className="size-10">
                                            <AvatarImage src={req.senderId.imageUrl} />
                                            <AvatarFallback>{req.senderId.fullName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-base text-white">{req.senderId.fullName}</CardTitle>
                                            <CardDescription>wants to be friends</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex gap-3 pt-0">
                                        <Button 
                                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                                            onClick={() => acceptFriendRequest(req.senderId._id)}
                                        >
                                            <Check className="size-4 mr-2" />
                                            Accept
                                        </Button>
                                        <Button 
                                            variant="destructive"
                                            className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 border border-red-500/20"
                                            onClick={() => rejectFriendRequest(req.senderId._id)}
                                        >
                                            <X className="size-4 mr-2" />
                                            Decline
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SocialPage;
