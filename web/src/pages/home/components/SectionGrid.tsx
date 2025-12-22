import { Song } from '@/types';
import { useState } from 'react'
import SectionGridSkeleton from './SectionGridSkeleton';
import { Button } from '@/components/ui/button';
import PlayButton from './PlayButton';
import { AddPlaylistDialog } from '@/components/AddPlaylistDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ListPlus, MoreHorizontal } from 'lucide-react';

type SectionGridProps = {
title: string;
songs: Song[],
isLoading:boolean;

}
const SectionGrid = ({songs,title,isLoading}:SectionGridProps) => {
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);

    if (isLoading) return <SectionGridSkeleton />;
  return (
    <div className='mb-8'>
    {selectedSong && (
        <AddPlaylistDialog
            song={selectedSong}
            isOpen={isAddPlaylistOpen}
            onClose={() => setIsAddPlaylistOpen(false)}
        />
    )}
    <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl sm:text-2xl font-bold'>{title}</h2>
        <Button variant='link' className='text-sm text-zinc-400 hover:text-white'>
            Show all
        </Button>
    </div>

    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {songs.map((song) => (
            <div
                key={song._id}
                className='bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer relative'
            >
                <div className='relative mb-4'>
                    <div className='aspect-square rounded-md shadow-lg overflow-hidden'>
                        <img
                            src={song.imageUrl}
                            alt={song.title}
                            className='w-full h-full object-cover transition-transform duration-300 
                            group-hover:scale-105'
                        />
                    </div>
                    <PlayButton song={song} />
                </div>
                <div className='flex justify-between items-start'>
                    <div className='flex-1 min-w-0'>
                        <h3 className='font-medium mb-2 truncate'>{song.title}</h3>
                        <p className='text-sm text-zinc-400 truncate'>{song.artist}</p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40 bg-zinc-900 border-zinc-800">
                            <DropdownMenuItem 
                                className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
                                onClick={() => {
                                    setSelectedSong(song);
                                    setIsAddPlaylistOpen(true);
                                }}
                            >
                                <ListPlus className="mr-2 h-4 w-4" />
                                <span>Add to Playlist</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        ))}
    </div>
</div>
  )
}

export default SectionGrid