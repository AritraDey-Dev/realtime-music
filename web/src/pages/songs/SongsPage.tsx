import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";

const SongsPage = () => {
    const { songs, fetchAllSongs, isLoading } = useMusicStore();
    const { currentSong, isPlaying, togglePlay, setCurrentSong } = usePlayerStore();

    useEffect(() => {
        fetchAllSongs();
    }, [fetchAllSongs]);

    const handlePlaySong = (song: any) => {
        if (currentSong?._id === song._id) {
            togglePlay();
        } else {
            setCurrentSong(song);
        }
    };

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
        </div>
    );

    return (
        <div className="h-full bg-gradient-to-b from-zinc-900 to-black flex flex-col">
            <div className="p-6">
                <h1 className="text-3xl font-bold text-white mb-2">All Songs</h1>
                <p className="text-zinc-400">Discover new music from our entire collection.</p>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-6 pt-0">
                    <div className="space-y-2">
                        {songs.map((song, index) => {
                            const isCurrentSong = currentSong?._id === song._id;
                            return (
                                <div 
                                    key={song._id} 
                                    className="group flex items-center gap-4 p-2 rounded-md hover:bg-zinc-800/50 transition-colors cursor-pointer"
                                    onClick={() => handlePlaySong(song)}
                                >
                                    <div className="w-8 text-center text-zinc-400 group-hover:hidden">
                                        {isCurrentSong && isPlaying ? (
                                            <div className="flex items-end justify-center gap-0.5 h-4">
                                                <span className="w-0.5 h-full bg-emerald-500 animate-music-bar-1" />
                                                <span className="w-0.5 h-full bg-emerald-500 animate-music-bar-2" />
                                                <span className="w-0.5 h-full bg-emerald-500 animate-music-bar-3" />
                                            </div>
                                        ) : (
                                            <span className={isCurrentSong ? "text-emerald-500" : ""}>{index + 1}</span>
                                        )}
                                    </div>
                                    <div className="hidden group-hover:flex w-8 items-center justify-center">
                                        {isCurrentSong && isPlaying ? (
                                            <Pause className="size-4 text-white" />
                                        ) : (
                                            <Play className="size-4 text-white" />
                                        )}
                                    </div>

                                    <div className="relative size-10 rounded overflow-hidden">
                                        <img src={song.imageUrl} alt={song.title} className="object-cover w-full h-full" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className={`font-medium truncate ${isCurrentSong ? "text-emerald-500" : "text-white"}`}>
                                            {song.title}
                                        </p>
                                        <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                                    </div>

                                    <div className="hidden md:block text-sm text-zinc-400 w-12 text-right">
                                        {formatDuration(song.duration)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default SongsPage;
