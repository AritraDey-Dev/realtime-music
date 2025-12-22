import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader, Music, UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { axiosInstance } from '@/lib/axios';
import { Playlist, User } from '@/types';

interface UserProfile extends Omit<User, 'playlists'> {
    playlists: Playlist[];
}

const ProfilePage = () => {
    const { userId } = useParams();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get(`/users/profile/${userId}`);
                setUserProfile(response.data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchUserProfile();
        }
    }, [userId]);

    if (isLoading) {
        return (
            <div className='h-full flex items-center justify-center'>
                <Loader className='size-8 text-emerald-500 animate-spin' />
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className='h-full flex items-center justify-center'>
                <p className='text-zinc-400'>User not found</p>
            </div>
        );
    }

    return (
        <div className='h-full flex flex-col'>
            <div className='flex flex-col sm:flex-row items-center sm:items-end gap-6 p-6 bg-gradient-to-b from-zinc-800 to-zinc-900'>
                <Avatar className='w-40 h-40 border-4 border-zinc-900 shadow-xl'>
                    <AvatarImage src={userProfile.imageUrl} alt={userProfile.fullName} className='object-cover' />
                    <AvatarFallback className='text-4xl bg-zinc-800 text-zinc-400'>
                        {userProfile.fullName[0]}
                    </AvatarFallback>
                </Avatar>

                <div className='flex flex-col gap-2 text-center sm:text-left flex-1'>
                    <span className='text-sm font-medium uppercase text-zinc-400'>Profile</span>
                    <h1 className='text-4xl sm:text-6xl font-bold text-white mb-2'>{userProfile.fullName}</h1>
                    
                    <div className='flex items-center gap-4 text-zinc-400 text-sm'>
                        <div className='flex items-center gap-1'>
                            <UserIcon className='size-4' />
                            <span>{userProfile.friends.length} Friends</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <Music className='size-4' />
                            <span>{userProfile.playlists.length} Playlists</span>
                        </div>
                    </div>
                </div>
            </div>

            <ScrollArea className='flex-1 p-6'>
                <div className='space-y-8'>
                    {/* Playlists Section */}
                    <div>
                        <h2 className='text-2xl font-bold text-white mb-4'>Public Playlists</h2>
                        {userProfile.playlists && userProfile.playlists.length > 0 ? (
                            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                                {userProfile.playlists.map((playlist: Playlist) => (
                                    <Link 
                                        to={`/playlists/${playlist._id}`}
                                        key={playlist._id} 
                                        className='group relative p-4 rounded-md bg-zinc-800/40 hover:bg-zinc-800/80 transition-all duration-300 cursor-pointer block'
                                    >
                                        <div className='relative aspect-square mb-4 overflow-hidden rounded-md shadow-lg'>
                                            <img 
                                                src={playlist.imageUrl || '/music_app.png'} 
                                                alt={playlist.title}
                                                className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                                            />
                                        </div>
                                        <h3 className='font-semibold text-white truncate'>{playlist.title}</h3>
                                        <p className='text-sm text-zinc-400 truncate'>By {userProfile.fullName}</p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className='text-zinc-400'>No public playlists yet.</p>
                        )}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default ProfilePage;
