import { SignedIn, SignedOut, SignOutButton, UserButton, useUser } from '@clerk/clerk-react'
import { LayoutDashboardIcon, Search, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SignedInAuthButton from './SignedInAuthButton'
import { useAuthStore } from '@/stores/useAuthStore'
import { cn } from '@/lib/utils'
import { buttonVariants } from './ui/button'
import { Input } from './ui/input'

const Topbar = () => {
    const isAdmin = useAuthStore();
    const user=useUser();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    console.log(isAdmin)
    return (
        <div className='flex 
    items-center 
    justify-between
     p-4 sticky 
     top-0
      bg-zinc-900/75 backdrop-blur-md z-10'>
            <div className='flex gap-2 items-center'>
                <img src='/music_app.png' className='size-8' alt='VibeStream' />
                <div className='text-2xl text-amber-600'>VibeStream</div>
            </div>

            <div className='flex-1 max-w-md mx-4 hidden md:block'>
                <form onSubmit={handleSearch} className='relative'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400' />
                    <Input 
                        placeholder='Search songs, albums, artists...' 
                        className='bg-zinc-800 border-zinc-700 pl-10 rounded-full'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
            </div>

            <div className='flex gap-4 items-center'>
                {isAdmin && user &&(
                    <Link to={"/admin"} className={cn(buttonVariants({ variant: "outline" }))}>
                        <LayoutDashboardIcon className='size-4  mr-2' />
                        Admin Dashboard
                    </Link>
                )}
                <SignedIn>
                    <SignOutButton />
                </SignedIn>
                <SignedOut>
                    <SignedInAuthButton />
                </SignedOut>
                
                <Link to={`/profile/${user?.user?.id}`} className='flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity mr-2'>
                    <span className='text-sm font-medium text-white hidden sm:block'>{user?.user?.fullName}</span>
                </Link>

                <Link to="/ai" className='p-2 hover:bg-zinc-800 rounded-full transition-colors'>
                    <Sparkles className='size-5 text-emerald-500' />
                </Link>

                <UserButton />
            </div>
        </div>
    )
}

export default Topbar