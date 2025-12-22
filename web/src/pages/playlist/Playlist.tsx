import { usePlaylistStore } from '@/stores/usePlaylistStore';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Trash2, MoreHorizontal, ListPlus, Edit, Globe, Lock, Search, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EditPlaylistModal } from '@/components/EditPlaylistModal';
import { Input } from '@/components/ui/input';
import { useMusicStore } from '@/stores/useMusicStore';
import { Song } from '@/types';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableSongRow = ({ song, index, isPlaying, currentSong, playAlbum, handleRemoveSong }: any) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: `${song._id}-${index}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className='group grid grid-cols-[16px_4fr_2fr_1fr] gap-4 items-center p-2 rounded-md hover:bg-white/5 transition-colors'
        >
            <div {...attributes} {...listeners} className='cursor-grab active:cursor-grabbing'>
                 <GripVertical className='h-4 w-4 text-zinc-600 group-hover:text-zinc-400' />
            </div>
            
            <div className='flex items-center gap-3'>
                <div className='relative group/play'>
                    <img src={song.imageUrl} alt={song.title} className='w-10 h-10 rounded' />
                    <div 
                        className={`absolute inset-0 flex items-center justify-center bg-black/40 ${isPlaying && currentSong?._id === song._id ? 'opacity-100' : 'opacity-0 group-hover/play:opacity-100'} transition-opacity cursor-pointer`}
                        onClick={() => playAlbum([song], 0)}
                    >
                        {isPlaying && currentSong?._id === song._id ? (
                             <Pause className='h-4 w-4 text-white' />
                        ) : (
                            <Play className='h-4 w-4 text-white' />
                        )}
                    </div>
                </div>
                <div>
                    <div className='font-medium text-white'>{song.title}</div>
                    <div className='text-sm text-zinc-400'>{song.artist}</div>
                </div>
            </div>
            
            <div className='text-sm text-zinc-400'>{song.albumId || 'Single'}</div>
            
            <div className='flex items-center justify-end gap-2'>
                <span className='text-sm text-zinc-400'>{song.duration}s</span>
                <Button
                    variant='ghost'
                    size='icon'
                    className='opacity-0 group-hover:opacity-100 hover:text-red-500'
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSong(song._id);
                    }}
                >
                    <Trash2 className='h-4 w-4' />
                </Button>
            </div>
        </div>
    );
};

const Playlist = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchPlaylistById, currentPlaylist, isLoading, removeSongFromPlaylist, deletePlaylist, addSongToPlaylist, reorderPlaylist } = usePlaylistStore();
    const { currentSong, isPlaying, playAlbum, addToQueue } = usePlayerStore();
    const { searchSongs } = useMusicStore();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Song[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const search = async () => {
            if (searchQuery.length > 2) {
                const songs = await searchSongs(searchQuery);
                setSearchResults(songs);
            } else {
                setSearchResults([]);
            }
        };
        const timeoutId = setTimeout(search, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, searchSongs]);

    const handleAddSong = async (songId: string) => {
        if (id) {
            await addSongToPlaylist(id, songId);
            fetchPlaylistById(id);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (over && active.id !== over.id && currentPlaylist) {
            const oldIndex = currentPlaylist.songs.findIndex((song, i) => `${song._id}-${i}` === active.id);
            const newIndex = currentPlaylist.songs.findIndex((song, i) => `${song._id}-${i}` === over.id);
            
            if (oldIndex !== -1 && newIndex !== -1) {
                const newOrder = arrayMove(currentPlaylist.songs, oldIndex, newIndex);
                // Optimistic update handled by store, but we need to pass IDs
                await reorderPlaylist(currentPlaylist._id, newOrder.map(s => s._id));
            }
        }
    };

    useEffect(() => {
        if (id) {
            fetchPlaylistById(id);
        }
    }, [id, fetchPlaylistById]);

    if (isLoading) return <div className='h-full flex items-center justify-center'>Loading...</div>;
    if (!currentPlaylist) return <div className='h-full flex items-center justify-center'>Playlist not found</div>;

    const handlePlayPlaylist = () => {
        if (!currentPlaylist.songs.length) return;
        playAlbum(currentPlaylist.songs, 0);
    };

    const handleRemoveSong = async (songId: string) => {
        if (id) {
            await removeSongFromPlaylist(id, songId);
            fetchPlaylistById(id); // Refresh playlist
        }
    };

    const handleDeletePlaylist = async () => {
        if (id) {
            await deletePlaylist(id);
            navigate('/');
        }
    };

    return (
        <div className='h-full flex flex-col'>
            <EditPlaylistModal 
                playlist={currentPlaylist} 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
            />
            
            {/* Header */}
            <div className='flex items-end gap-6 p-6 bg-gradient-to-b from-zinc-800 to-zinc-900'>
                <img
                    src={currentPlaylist.imageUrl || '/music_app.png'}
                    alt={currentPlaylist.title}
                    className='w-60 h-60 object-cover rounded-md shadow-lg'
                />
                <div className='flex flex-col gap-2 flex-1'>
                    <div className='flex items-center gap-2'>
                        <span className='text-sm font-medium uppercase text-zinc-400'>
                            {currentPlaylist.isPublic ? 'Public Playlist' : 'Private Playlist'}
                        </span>
                        {currentPlaylist.isPublic ? (
                            <Globe className='w-4 h-4 text-zinc-400' />
                        ) : (
                            <Lock className='w-4 h-4 text-zinc-400' />
                        )}
                    </div>
                    <h1 className='text-7xl font-bold text-white'>{currentPlaylist.title}</h1>
                    <p className='text-zinc-400 text-sm'>{currentPlaylist.description}</p>
                    <div className='flex items-center gap-2 mt-4'>
                        <span className='text-sm text-zinc-400'>
                            {currentPlaylist.songs.length} songs
                        </span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className='flex items-center gap-4 p-6'>
                <Button
                    onClick={handlePlayPlaylist}
                    className='bg-green-500 hover:bg-green-400 text-black rounded-full w-14 h-14 flex items-center justify-center'
                >
                    {isPlaying && currentPlaylist.songs.some(s => s._id === currentSong?._id) ? (
                        <Pause className='h-6 w-6 fill-black' />
                    ) : (
                        <Play className='h-6 w-6 fill-black translate-x-0.5' />
                    )}
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                            <MoreHorizontal className="w-6 h-6" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800">
                        <DropdownMenuItem 
                            className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
                            onClick={() => addToQueue(currentPlaylist.songs)}
                        >
                            <ListPlus className="mr-2 h-4 w-4" />
                            <span>Add to queue</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800 text-red-500 focus:text-red-500"
                            onClick={handleDeletePlaylist}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Songs List */}
            <ScrollArea className='flex-1 p-6'>
                <DndContext 
                    sensors={sensors} 
                    collisionDetection={closestCenter} 
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext 
                        items={currentPlaylist.songs.map((s, i) => `${s._id}-${i}`)} 
                        strategy={verticalListSortingStrategy}
                    >
                        <div className='space-y-2'>
                            {currentPlaylist.songs.map((song, index) => (
                                <SortableSongRow
                                    key={`${song._id}-${index}`}
                                    song={song}
                                    index={index}
                                    isPlaying={isPlaying}
                                    currentSong={currentSong}
                                    playAlbum={playAlbum}
                                    handleRemoveSong={handleRemoveSong}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                <div className="mt-8 border-t border-white/5 pt-8">
                    <h2 className="text-xl font-bold mb-4">Let's find something for your playlist</h2>
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                            placeholder="Search for songs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-zinc-800 border-zinc-700 pl-10"
                        />
                    </div>

                    <div className="space-y-2">
                        {searchResults.map((song) => {
                             const isAlreadyInPlaylist = currentPlaylist.songs.some(s => s._id === song._id);
                             return (
                                <div
                                    key={song._id}
                                    className='group flex items-center justify-between p-2 rounded-md hover:bg-white/5 transition-colors'
                                >
                                    <div className='flex items-center gap-3'>
                                        <img src={song.imageUrl} alt={song.title} className='w-10 h-10 rounded' />
                                        <div>
                                            <div className='font-medium text-white'>{song.title}</div>
                                            <div className='text-sm text-zinc-400'>{song.artist}</div>
                                        </div>
                                    </div>
                                    
                                    <Button
                                        variant='outline'
                                        size='sm'
                                        onClick={() => handleAddSong(song._id)}
                                        disabled={isAlreadyInPlaylist}
                                        className={isAlreadyInPlaylist ? 'opacity-50 cursor-not-allowed' : ''}
                                    >
                                        {isAlreadyInPlaylist ? 'Added' : 'Add'}
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default Playlist;