import FeaturedGridSkeleton from '@/components/skeletons/FeaturedGridSkeleton';
import { useMusicStore } from '@/stores/useMusicStore';
import { useState } from 'react'
import PlayButton from './PlayButton';
import { AddPlaylistDialog } from '@/components/AddPlaylistDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ListPlus, MoreHorizontal } from 'lucide-react';
import { Song } from '@/types';

const FeaturedSection = () => {

    const {isLoading,featuredSongs,error}=useMusicStore();
    const [selectedSong, setSelectedSong] = useState<Song | null>(null);
    const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);

	console.log("featuredSongs",featuredSongs)
  if (isLoading)  return <FeaturedGridSkeleton />
  if(error) return <div className='text-red-500'>{error}</div>
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
        {selectedSong && (
            <AddPlaylistDialog
                song={selectedSong}
                isOpen={isAddPlaylistOpen}
                onClose={() => setIsAddPlaylistOpen(false)}
            />
        )}
			{featuredSongs.map((song) => (
				<div
					key={song._id}
					className='flex items-center bg-zinc-800/50 rounded-md overflow-hidden
         hover:bg-zinc-700/50 transition-colors group cursor-pointer relative'
				>
					<img
						src={song.imageUrl}
						alt={song.title}
						className='w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0'
					/>
					<div className='flex-1 p-4 min-w-0'>
						<p className='font-medium truncate'>{song.title}</p>
						<p className='text-sm text-zinc-400 truncate'>{song.artist}</p>
						
					</div>
					<PlayButton song={song} />
                    <div className='mr-2'>
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
  )
}

export default FeaturedSection