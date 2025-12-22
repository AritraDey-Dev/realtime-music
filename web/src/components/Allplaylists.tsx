import { usePlaylistStore } from '@/stores/usePlaylistStore';
import React, { useEffect } from 'react'
import PlaylistSkeleton from './skeletons/PlaylistSkeleton';
import { Link } from 'react-router-dom';

const Allplaylists = () => {
    const { playlists, getAllPlaylists, isLoading } = usePlaylistStore();
    useEffect(() => {
        getAllPlaylists();

    }, [getAllPlaylists]);
    console.log(playlists)
    return (
        <div className='flex flex-col gap-2'>
            {isLoading ? (
                <PlaylistSkeleton />
            ) : (
                <>
                    <h2 className='text-white text-xl font-semibold mb-2'>Your Playlists</h2>
                    {playlists.length === 0 ? (
                        <div className='text-gray-400'>No playlists found.</div>
                    ) : (
                        playlists.map((playlist) => (
                            <Link
                                to={`/playlists/${playlist._id}`}
                                key={playlist._id}
                                className='p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer'
                            >
                                <img
                                    src={playlist.imageUrl}
                                    alt='Playlist img'
                                    className='size-12 rounded-md flex-shrink-0 object-cover'
                                />

                                <div className='flex-1 min-w-0 hidden md:block'>
                                    <p className='font-medium truncate'>{playlist.title}</p>
                                   
                                </div>
                            </Link>
                        ))
                    )}
                    </>
            )}
        </div>

    )
}

export default Allplaylists