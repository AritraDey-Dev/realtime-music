import { usePlaylistStore } from '@/stores/usePlaylistStore';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Song } from '@/types';

interface AddPlaylistDialogProps {
    song: Song;
    isOpen: boolean;
    onClose: () => void;
}

export const AddPlaylistDialog = ({ song, isOpen, onClose }: AddPlaylistDialogProps) => {
    const { playlists, addSongToPlaylist, isLoading } = usePlaylistStore();

    const handleAddToPlaylist = async (playlistId: string) => {
        await addSongToPlaylist(playlistId, song._id);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800">
                <DialogHeader>
                    <DialogTitle>Add to Playlist</DialogTitle>
                    <DialogDescription>
                        Choose a playlist to add "{song?.title}" to.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {playlists.length === 0 ? (
                        <div className="text-center text-zinc-400">No playlists found. Create one first!</div>
                    ) : (
                        <div className="space-y-2">
                            {playlists.map((playlist) => (
                                <Button
                                    key={playlist._id}
                                    variant="ghost"
                                    className="w-full justify-start text-left hover:bg-zinc-800"
                                    onClick={() => handleAddToPlaylist(playlist._id)}
                                    disabled={isLoading}
                                >
                                    <img 
                                        src={playlist.imageUrl || '/music_app.png'} 
                                        alt={playlist.title} 
                                        className="w-8 h-8 rounded mr-3 object-cover"
                                    />
                                    <span className="truncate">{playlist.title}</span>
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
