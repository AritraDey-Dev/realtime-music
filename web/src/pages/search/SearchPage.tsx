import { useMusicStore } from '@/stores/useMusicStore';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { Album, Song } from '@/types';
import { Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import PlayButton from '../home/components/PlayButton';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const { search, isLoading } = useMusicStore();
    const { playAlbum } = usePlayerStore();
    const [results, setResults] = useState<{ songs: Song[]; albums: Album[]; users: any[] }>({
        songs: [],
        albums: [],
        users: []
    });

    useEffect(() => {
        const fetchResults = async () => {
            if (query) {
                const data = await search(query);
                setResults(data);
            }
        };
        fetchResults();
    }, [query, search]);

    if (isLoading) return <div className='h-full flex items-center justify-center'>Searching...</div>;

    if (!query) return <div className='h-full flex items-center justify-center text-zinc-400'>Search for songs, albums, or artists</div>;

    if (!results.songs.length && !results.albums.length && !results.users.length) {
        return <div className='h-full flex items-center justify-center text-zinc-400'>No results found for "{query}"</div>;
    }

    return (
        <div className='h-full bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-md overflow-hidden'>
            <ScrollArea className='h-full p-6'>
                <h1 className='text-2xl font-bold mb-6'>Search Results for "{query}"</h1>

                {results.songs.length > 0 && (
                    <div className='mb-8'>
                        <h2 className='text-xl font-semibold mb-4'>Songs</h2>
                        <div className='space-y-2'>
                            {results.songs.map((song) => (
                                <div
                                    key={song._id}
                                    className='flex items-center justify-between p-2 rounded-md hover:bg-white/5 transition-colors group'
                                >
                                    <div className='flex items-center gap-3'>
                                        <div className='relative'>
                                            <img src={song.imageUrl} alt={song.title} className='w-12 h-12 rounded object-cover' />
                                            <div className='absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity'>
                                                <PlayButton song={song} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className='font-medium text-white'>{song.title}</div>
                                            <div className='text-sm text-zinc-400'>{song.artist}</div>
                                        </div>
                                    </div>
                                    <span className='text-sm text-zinc-400'>{song.duration}s</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {results.albums.length > 0 && (
                    <div className='mb-8'>
                        <h2 className='text-xl font-semibold mb-4'>Albums</h2>
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                            {results.albums.map((album) => (
                                <div key={album._id} className='bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer'>
                                    <div className='relative mb-4 aspect-square'>
                                        <img src={album.imageUrl} alt={album.title} className='w-full h-full object-cover rounded-md shadow-lg' />
                                        <Button
                                            className='absolute bottom-2 right-2 w-10 h-10 rounded-full bg-green-500 hover:bg-green-400 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-xl'
                                            onClick={() => playAlbum(album.songs, 0)}
                                        >
                                            <Play className='w-5 h-5 text-black fill-black' />
                                        </Button>
                                    </div>
                                    <h3 className='font-medium truncate'>{album.title}</h3>
                                    <p className='text-sm text-zinc-400 truncate'>{album.artist}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {results.users.length > 0 && (
                    <div className='mb-8'>
                        <h2 className='text-xl font-semibold mb-4'>Artists / Users</h2>
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                            {results.users.map((user) => (
                                <div key={user._id} className='flex flex-col items-center p-4 bg-zinc-800/40 rounded-md hover:bg-zinc-700/40 transition-all'>
                                    <img src={user.imageUrl} alt={user.fullName} className='w-32 h-32 rounded-full object-cover mb-4 shadow-lg' />
                                    <h3 className='font-medium truncate'>{user.fullName}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};

export default SearchPage;
