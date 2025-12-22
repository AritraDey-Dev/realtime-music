import { axiosInstance } from '@/lib/axios';
import { Playlist } from '@/types';
import {create} from 'zustand';

interface PlaylistStore {
    isLoading: boolean;
    error: string | null;
    playlists: Playlist[];
    setPlaylists: (playlists: Playlist[]) => void;
    getAllPlaylists: () => Promise<void>;
    fetchPlaylistById: (id: string) => Promise<void>;
    addSongToPlaylist: (playlistId:string,songId:string) => Promise<void>;
    removeSongFromPlaylist: (playlistId:string,songId:string) => Promise<void>;
    deletePlaylist: (id: string) => Promise<void>;
    createPlaylist: (title:string,description:string,imageUrl:string, isPublic: boolean) => Promise<void>;
    editPlaylist: (id: string, title: string, description: string, isPublic: boolean) => Promise<void>;
    getPlaylistSongs: (id: string) => Promise<void>;
    currentPlaylist: Playlist | null;
}

export const usePlaylistStore = create<PlaylistStore>((set,get) => ({
    currentPlaylist: null,
    playlists: [],
    isLoading: false,
    error: null,
    getAllPlaylists: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/playlists');
            set({ playlists: response.data.playlists });
        } catch (error:any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    }

    ,
    fetchPlaylistById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/playlists/${id}`);
            set({ currentPlaylist: response.data.playlist });
        } catch (error:any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    }
    ,
    addSongToPlaylist: async (playlistId,songId) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.post('/playlists/addtoPlaylist', { playlistId, songId });
            // Optionally refresh playlists or current playlist
        } catch (error:any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    removeSongFromPlaylist: async (playlistId,songId) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.post('/playlists/removeSongFromPlaylist', { playlistId, songId });
             // Optionally refresh playlists or current playlist
        } catch (error:any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },
    
    deletePlaylist: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.delete(`/playlists/${id}`);
            set({ playlists: get().playlists.filter((playlist) => playlist._id !== id) });
        } catch (error:any) {
            set({ error: error.response.data.message });
        }
        finally {
            set({ isLoading: false });
        }
    },

    createPlaylist: async (title,description,imageUrl, isPublic) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post('/playlists',{
                title,
                description,
                imageUrl,
                isPublic
            }); 
            set({ playlists: [...get().playlists, response.data.playlist] });
        } catch (error:any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    editPlaylist: async (id, title, description, isPublic) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.put(`/playlists/${id}`, {
                title,
                description,
                isPublic
            });
            // Update current playlist if it's the one being edited
            if (get().currentPlaylist?._id === id) {
                set({ currentPlaylist: response.data.playlist });
            }
            // Update playlists list
            set({
                playlists: get().playlists.map((p) => 
                    p._id === id ? response.data.playlist : p
                )
            });
        } catch (error:any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

    getPlaylistSongs: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/playlists/${id}/songs`);
            set({ playlists: [response.data.playlist] });
        } catch (error:any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },
    setPlaylists: (playlists) => set({ playlists }),
}));