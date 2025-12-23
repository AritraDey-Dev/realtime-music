import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePartyStore } from "@/stores/usePartyStore";
import { useUser } from "@clerk/clerk-react";
import { Copy, LogOut, Music2, Plus, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMusicStore } from "@/stores/useMusicStore";

export const PartyRoom = () => {
    const { roomId, connectedUsers, votingQueue, leaveParty, voteSong, addToVote } = usePartyStore();
    const { user } = useUser();
    const { songs, fetchSongs } = useMusicStore(); 
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchSongs();
        }
    }, [isOpen, fetchSongs]);

    const copyRoomId = () => {
        if (roomId) {
            navigator.clipboard.writeText(roomId);
            toast.success("Room ID copied!");
        }
    };

    const handleVote = (songId: string) => {
        if (user) voteSong(songId, user.id);
    };

    const handleAddSong = (song: any) => {
        addToVote(song);
        toast.success("Song added to voting queue!");
    };

    if (!roomId) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="flex items-center gap-2 px-2 py-2 text-white bg-zinc-800/50 rounded-md mt-2 cursor-pointer hover:bg-zinc-800 transition-colors">
                    <Music2 className="size-5 text-emerald-500 animate-pulse" />
                    <div className="flex-1 min-w-0 hidden md:block">
                        <p className="text-sm font-medium truncate">Party Active</p>
                        <p className="text-xs text-zinc-400 truncate">ID: {roomId}</p>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span>Party Room</span>
                            <span className="text-xs font-normal text-zinc-400 bg-zinc-800 px-2 py-1 rounded">{roomId}</span>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={copyRoomId}>
                                <Copy className="size-3" />
                            </Button>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => { leaveParty(); setIsOpen(false); }}>
                            <LogOut className="size-4 mr-2" />
                            Leave
                        </Button>
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="voting" className="flex-1 flex flex-col min-h-0">
                    <TabsList className="bg-zinc-800 w-full justify-start">
                        <TabsTrigger value="voting">Voting Queue ({votingQueue.length})</TabsTrigger>
                        <TabsTrigger value="users">Users ({connectedUsers.length})</TabsTrigger>
                        <TabsTrigger value="add">Add Songs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="voting" className="flex-1 min-h-0">
                        <ScrollArea className="h-full pr-4">
                            {votingQueue.length === 0 ? (
                                <div className="text-center text-zinc-500 py-10">
                                    No songs in queue. Add some!
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {votingQueue.map((item) => (
                                        <div key={item.song._id} className="flex items-center gap-3 p-2 rounded-md bg-zinc-800/50">
                                            <img src={item.song.imageUrl} alt={item.song.title} className="size-10 rounded object-cover" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{item.song.title}</p>
                                                <p className="text-xs text-zinc-400 truncate">{item.song.artist}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-emerald-500">{item.votes.length}</span>
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className={`hover:text-emerald-500 ${user && item.votes.includes(user.id) ? "text-emerald-500" : "text-zinc-400"}`}
                                                    onClick={() => handleVote(item.song._id)}
                                                >
                                                    <ThumbsUp className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="users" className="flex-1 min-h-0">
                        <ScrollArea className="h-full">
                            <div className="space-y-2">
                                {connectedUsers.map((userId, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800/50">
                                        <Avatar className="size-8">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`} />
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">User {userId.slice(0, 8)}...</p>
                                            {user?.id === userId && <span className="text-xs text-emerald-500">(You)</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="add" className="flex-1 min-h-0">
                         <ScrollArea className="h-full pr-4">
                            <div className="space-y-2">
                                {songs.map((song) => (
                                    <div key={song._id} className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800/50 group">
                                        <img src={song.imageUrl} alt={song.title} className="size-10 rounded object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{song.title}</p>
                                            <p className="text-xs text-zinc-400 truncate">{song.artist}</p>
                                        </div>
                                        <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleAddSong(song)}>
                                            <Plus className="size-4 mr-1" /> Add
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};
