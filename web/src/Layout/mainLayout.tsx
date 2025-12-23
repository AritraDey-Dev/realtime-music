import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom';
import LeftSidebar from './components/LeftSidebar';
import FriendsActivity from './components/FriensActivity';
import AudioPlayer from './components/AudioPlayer';
import PlayBackControls from './components/PlayBackControls';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useChatStore } from '@/stores/useChatStore';
import { useUser } from '@clerk/clerk-react';

import AudioVisualizer from '@/components/AudioVisualizer';

const MainLayout = () => {
    const [isMobile, setIsMobile] = useState(false);
    const { currentSong, isPlaying } = usePlayerStore();
    const { user } = useUser();
    const { updateActivity, initSocket, disconnectSocket } = useChatStore();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        }
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => {
            window.removeEventListener('resize', checkMobile);
        }
    }, []);

    useEffect(() => {
        if (user) {
            initSocket(user.id);
        } else {
            disconnectSocket();
        }
    }, [initSocket, disconnectSocket, user]);

    useEffect(() => {
        if (currentSong && isPlaying) {
            updateActivity(JSON.stringify({
                type: "playing",
                song: currentSong,
                title: currentSong.title,
                artist: currentSong.artist
            }));
        } else {
            updateActivity(JSON.stringify({ type: "idle" }));
        }
    }, [currentSong, isPlaying, updateActivity]);
       

    return (
        <div className='h-screen bg-black text-white flex flex-col' >
            <AudioVisualizer />
            <ResizablePanelGroup direction='horizontal' className='flex-1 flex h-full overflow-hidden p-2'>
                <AudioPlayer/>
                <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}>
                   <LeftSidebar/>
                </ResizablePanel>
                <ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />
                <ResizablePanel defaultSize={isMobile ? 80 : 60}>
                    <Outlet />

                </ResizablePanel>
                {!isMobile && (
					<>
						<ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />
						<ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
							<FriendsActivity />
						</ResizablePanel>
					</>
				)}
            </ResizablePanelGroup>
            <PlayBackControls/>
        </div>
    ) 
}

export default MainLayout