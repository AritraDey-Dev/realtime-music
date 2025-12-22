import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { usePartyStore } from "@/stores/usePartyStore";
import { useUser } from "@clerk/clerk-react";
import { Copy, Music2, Users, LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const PartyControl = () => {
    const { roomId, createParty, joinParty, leaveParty } = usePartyStore();
    const { user } = useUser();
    const [joinRoomId, setJoinRoomId] = useState("");

    const handleCreate = () => {
        if (user) createParty(user.id);
    };

    const handleJoin = () => {
        if (user && joinRoomId) joinParty(joinRoomId, user.id);
    };

    const copyRoomId = () => {
        if (roomId) {
            navigator.clipboard.writeText(roomId);
            toast.success("Room ID copied!");
        }
    };

    if (roomId) {
        return (
            <div className="flex items-center gap-2 px-2 py-2 text-white bg-zinc-800/50 rounded-md mt-2">
                <Music2 className="size-5 text-emerald-500 animate-pulse" />
                <div className="flex-1 min-w-0 hidden md:block">
                    <p className="text-sm font-medium truncate">Party Active</p>
                    <p className="text-xs text-zinc-400 truncate">ID: {roomId}</p>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-white" onClick={copyRoomId} title="Copy ID">
                    <Copy className="size-4" />
                </Button>
                <Button size="icon" variant="destructive" className="h-8 w-8" onClick={leaveParty} title="Leave Party">
                    <LogOut className="size-4" />
                </Button>
            </div>
        );
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-zinc-800">
                    <Users className="mr-2 size-5" />
                    <span className="hidden md:inline">Party Mode</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle>Join the Party 🎉</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="font-medium">Create a Room</h3>
                        <p className="text-sm text-zinc-400">Start a new party and invite friends!</p>
                        <Button onClick={handleCreate} className="w-full bg-emerald-500 hover:bg-emerald-600">
                            Create Party
                        </Button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-zinc-900 px-2 text-zinc-400">Or join existing</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Input 
                            placeholder="Enter Room ID" 
                            value={joinRoomId}
                            onChange={(e) => setJoinRoomId(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                        />
                        <Button onClick={handleJoin} className="w-full" variant="secondary">
                            Join Party
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
