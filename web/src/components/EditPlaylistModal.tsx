import { usePlaylistStore } from '@/stores/usePlaylistStore';
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Playlist } from '@/types';

interface EditPlaylistModalProps {
    playlist: Playlist;
    isOpen: boolean;
    onClose: () => void;
}

export const EditPlaylistModal = ({ playlist, isOpen, onClose }: EditPlaylistModalProps) => {
    const { editPlaylist, isLoading } = usePlaylistStore();
    const [title, setTitle] = useState(playlist.title);
    const [description, setDescription] = useState(playlist.description);
    const [isPublic, setIsPublic] = useState(playlist.isPublic || false);

    useEffect(() => {
        setTitle(playlist.title);
        setDescription(playlist.description);
        setIsPublic(playlist.isPublic || false);
    }, [playlist]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await editPlaylist(playlist._id, title, description, isPublic);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800">
                <DialogHeader>
                    <DialogTitle>Edit Playlist</DialogTitle>
                    <DialogDescription>
                        Make changes to your playlist here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="col-span-3 bg-zinc-800 border-zinc-700"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="col-span-3 bg-zinc-800 border-zinc-700"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="isPublic" className="text-right">
                            Public
                        </Label>
                        <div className="col-span-3 flex items-center space-x-2">
                             <input
                                type="checkbox"
                                id="isPublic"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm text-zinc-400">Make this playlist public</span>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
