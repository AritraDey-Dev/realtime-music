import {create} from 'zustand';

import { Song } from '@/types';

interface PlayerStore {
    currentSong: Song | null;
    isPlaying: boolean;
    queue: Song[];
    currentIndex: number;
    initializedQueue: (songs: Song[]) => void;
    playAlbum: (songs: Song[], startindex: number) => void;
    setCurrentSong: (song: Song | null) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
}

export const usePlayerStore = create<PlayerStore>((set,get) => ({
    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: 0,

    initializedQueue: (songs:Song[]) => {
        set({
            queue: songs,
            currentSong: get().currentSong || songs[0],
            currentIndex: get().currentIndex===-1 ? 0 : get().currentIndex,
        })
    },
    playAlbum: (songs: Song[], startindex: number) => {
        if(songs.length === 0) return;
        const song = songs[startindex];
        set({
            queue: songs,
            currentSong: song,
            currentIndex: startindex,
            isPlaying: true,
        });
    },
    setCurrentSong: (song: Song | null) => {
        if (!song) return;
        const songIndex = get().queue.findIndex((s) => s._id === song._id);
        set({ currentSong: song,isPlaying: true
            ,currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
         });
   
    },
    togglePlay: () => {
        const willstartPlaying = !get().isPlaying;
        set({ isPlaying: willstartPlaying });
    },
    playNext: () => {
        const {currentIndex, queue} = get();
        const nextIndex = currentIndex + 1;
       if(nextIndex <= queue.length) {
            const nextSong = queue[nextIndex];
            set({
                currentSong: nextSong,
                currentIndex: nextIndex,
                isPlaying: true,
            });
        }else{
            set({
                currentSong: queue[0],
                currentIndex: 0,
                isPlaying: true,
            });
        }
    },
    playPrevious: () => {
        const {currentIndex, queue} = get();
        const previousIndex = currentIndex - 1;
        if(previousIndex >= 0) {
            const previousSong = queue[previousIndex];
            set({
                currentSong: previousSong,
                currentIndex: previousIndex,
                isPlaying: true,
            });
        }else{
            set({
                currentSong: queue[queue.length - 1],
                currentIndex: queue.length - 1,
                isPlaying: true,
            });
        }
    },
}));

