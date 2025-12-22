import { usePlaylistStore } from '@/stores/usePlaylistStore';
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface CreatePlaylistModalProps {
    children: React.ReactNode;
}

export const CreatePlaylistModal = ({ children }: CreatePlaylistModalProps) => {
    const { createPlaylist, isLoading } = usePlaylistStore();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;
        await createPlaylist(title, description, '', isPublic);
        setOpen(false);
        setTitle('');
        setDescription('');
        setIsPublic(true);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800">
                <DialogHeader>
                    <DialogTitle>Create Playlist</DialogTitle>
                    <DialogDescription>
                        Add a new playlist to your library.
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
                            {isLoading ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
