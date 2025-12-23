import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatStore } from '@/stores/useChatStore';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useUser } from '@clerk/clerk-react';
import { HeadphonesIcon, Music, Users } from 'lucide-react';
import { useEffect } from 'react'

const FriendsActivity = () => {
   const { users, fetchUsers, onlineUsers, userActivities } = useChatStore();
    const {user}=useUser();
    useEffect(() => {
       if(user) fetchUsers();
    }, [fetchUsers, user]);
    
  return (
    <div className='h-full bg-zinc-900/50 border-l border-zinc-800 flex flex-col backdrop-blur-sm'>
        <div className='p-4 flex justify-between items-center border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10'>
            <div className='flex items-center gap-2'>
                <Users className='size-5 shrink-0 text-emerald-400' />
                <h2 className='font-semibold text-white tracking-tight'>Friend Activity</h2>
            </div>
        </div>
       
        {!user && <LoginPrompt />}
       
        <ScrollArea className='flex-1'>
            <div className='p-4 space-y-4'>
                {users.map((user) => {
                    const activityStr = userActivities.get(user.clerkId);
                    let isPlaying = false;
                    let songTitle = "";
                    let songArtist = "";
                    let currentSong = null;

                    try {
                        if (activityStr && activityStr !== "Idle") {
                            const activity = JSON.parse(activityStr);
                            if (activity.type === "playing") {
                                isPlaying = true;
                                songTitle = activity.title;
                                songArtist = activity.artist;
                                currentSong = activity.song;
                            }
                        }
                    } catch (e) {
                        if (activityStr && activityStr !== "Idle" && activityStr.startsWith("Playing ")) {
                            isPlaying = true;
                            const parts = activityStr.replace("Playing ", "").split(" by ");
                            songTitle = parts[0];
                            songArtist = parts[1];
                        }
                    }

                    return (
                        <div
                            key={user._id}
                            className={`cursor-pointer p-3 rounded-xl transition-all duration-300 group border border-transparent
                                ${isPlaying ? "bg-zinc-800/40 hover:bg-zinc-800/60 hover:border-emerald-500/30" : "hover:bg-zinc-800/30"}
                            `}
                            onClick={() => {
                                if (isPlaying && currentSong) {
                                    usePlayerStore.getState().setCurrentSong(currentSong);
                                    usePlayerStore.getState().togglePlay();
                                }
                            }}
                        >
                            <div className='flex items-start gap-3'>
                                <div className='relative'>
                                    <Avatar className={`size-10 border-2 transition-colors ${isPlaying ? "border-emerald-500" : "border-zinc-800"}`}>
                                        <AvatarImage src={user.imageUrl} alt={user.fullName} />
                                        <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div
                                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 
                                            ${onlineUsers.has(user.clerkId) ? "bg-emerald-500" : "bg-zinc-500"}
                                            `}
                                        aria-hidden='true'
                                    />
                                </div>

                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-center justify-between gap-2'>
                                        <span className='font-medium text-sm text-white truncate'>{user.fullName}</span>
                                        {isPlaying && (
                                            <div className="flex items-center gap-1">
                                                <span className="relative flex h-2 w-2">
                                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                </span>
                                                <Music className='size-3.5 text-emerald-400 shrink-0' />
                                            </div>
                                        )}
                                    </div>

                                    {isPlaying ? (
                                        <div className='mt-1.5'>
                                            <div className='text-sm text-white font-medium truncate hover:text-emerald-400 transition-colors'>
                                                {songTitle}
                                            </div>
                                            <div className='text-xs text-zinc-400 truncate'>
                                                {songArtist}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='mt-1.5 text-xs text-zinc-500 flex items-center gap-1'>
                                            <HeadphonesIcon className='size-3' />
                                            Idle
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </ScrollArea>
    </div>
  )
}

export default FriendsActivity


const LoginPrompt = () => (
	<div className='h-full flex flex-col items-center justify-center p-6 text-center space-y-4'>
		<div className='relative'>
			<div
				className='absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-lg
       opacity-75 animate-pulse'
				aria-hidden='true'
			/>
			<div className='relative bg-zinc-900 rounded-full p-4'>
				<HeadphonesIcon className='size-8 text-emerald-400' />
			</div>
		</div>

		<div className='space-y-2 max-w-[250px]'>
			<h3 className='text-lg font-semibold text-white'>See What Friends Are Playing</h3>
			<p className='text-sm text-zinc-400'>Login to discover what music your friends are enjoying right now</p>
		</div>
	</div>
);