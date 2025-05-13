import { SignedIn, SignedOut, SignOutButton, UserButton } from '@clerk/clerk-react'
import { LayoutDashboardIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import SignedInAuthButton from './SignedInAuthButton'
import { useAuthStore } from '@/stores/useAuthStore'
const Topbar = () => {
    const isAdmin = useAuthStore();
    console.log(isAdmin)
    return (
        <div className='flex 
    items-center 
    justify-between
     p-4 sticky 
     top-0
      bg-zinc-900/75 backdrop-blur-md z-10'>
            <div className='flex gap-2 items-center'>
                SPOTIFY
            </div>
            <div className='flex gap-4 items-center'>
                {isAdmin && (
                    <Link to="/admin">
                        <LayoutDashboardIcon className='size-4' />
                        Admin Dashboard
                    </Link>
                )}
                <SignedIn>
                <SignOutButton/>
                </SignedIn>
                <SignedOut>
                    <SignedInAuthButton/>
                </SignedOut>
                <UserButton />
            </div>
        </div>
    )
}

export default Topbar