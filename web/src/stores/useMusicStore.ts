import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats, User } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";
import { AxiosError } from "axios";

interface MusicStore {
	songs: Song[];
	albums: Album[];
	isLoading: boolean;
	error: string | null;
	currentAlbum: Album | null;
	featuredSongs: Song[];
	madeForYouSongs: Song[];
	trendingSongs: Song[];
	stats: Stats;

	fetchAlbums: () => Promise<void>;
	fetchAlbumById: (id: string) => Promise<void>;
	fetchFeaturedSongs: () => Promise<void>;
	fetchMadeForYouSongs: () => Promise<void>;
	fetchTrendingSongs: () => Promise<void>;
	fetchStats: () => Promise<void>;
	fetchSongs: () => Promise<void>;
	deleteSong: (id: string) => Promise<void>;
	deleteAlbum: (id: string) => Promise<void>;
	getLikedSongs: () => Promise<void>;
	likeSong: (id: string) => Promise<void>;
	searchSongs: (query: string) => Promise<Song[]>;
    search: (query: string) => Promise<{ songs: Song[]; albums: Album[]; users: User[] }>;
    fetchAllSongs: () => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
	albums: [],
	songs: [],
	isLoading: false,
	error: null,
	currentAlbum: null,
	madeForYouSongs: [],
	featuredSongs: [],
	trendingSongs: [],
	stats: {
		totalSongs: 0,
		totalAlbums: 0,
		totalUsers: 0,
		totalArtists: 0,
	},

	deleteSong: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/songs/${id}`);

			set((state) => ({
				songs: state.songs.filter((song) => song._id !== id),
			}));
			toast.success("Song deleted successfully");
		} catch (error) {
			console.log("Error in deleteSong", error);
			toast.error("Error deleting song");
		} finally {
			set({ isLoading: false });
		}
	},

	deleteAlbum: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/albums/${id}`);
			set((state) => ({
				albums: state.albums.filter((album) => album._id !== id),
				songs: state.songs.map((song) =>
					song.albumId === state.albums.find((a) => a._id === id)?.title ? { ...song, album: null } : song
				),
			}));
			toast.success("Album deleted successfully");
		} catch (error) {
			const message = (error as AxiosError<{ message: string }>).response?.data?.message || "Failed to delete album";
			toast.error(message);
		} finally {
			set({ isLoading: false });
		}
	},

	fetchSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs");
			set({ songs: response.data.songs });
		} catch (error) {
			const message = (error as AxiosError<{ message: string }>).message;
			set({ error: message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchStats: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/stats");
			set({ stats: response.data });
		} catch (error) {
			const message = (error as AxiosError<{ message: string }>).message;
			set({ error: message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbums: async () => {
		set({ isLoading: true, error: null });

		try {
			const response = await axiosInstance.get("/albums");
			set({ albums: response.data.albums });
		} catch (error) {
			const message = (error as AxiosError<{ message: string }>).response?.data?.message || "Failed to fetch albums";
			set({ error: message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbumById: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/albums/${id}`);
			set({ currentAlbum: response.data.album });
		} catch (error) {
			const message = (error as AxiosError<{ message: string }>).response?.data?.message || "Failed to fetch album";
			set({ error: message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchFeaturedSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/featured");
			set({ featuredSongs: response.data.songs });
		} catch (error) {
			const message = (error as AxiosError<{ message: string }>).response?.data?.message || "Failed to fetch featured songs";
			set({ error: message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchMadeForYouSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/made-for-you");
			set({ madeForYouSongs: response.data.songs });
		} catch (error) {
			const message = (error as AxiosError<{ message: string }>).response?.data?.message || "Failed to fetch made for you songs";
			set({ error: message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchTrendingSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/trending");
			set({ trendingSongs: response.data.songs });
		} catch (error) {
			const message = (error as AxiosError<{ message: string }>).response?.data?.message || "Failed to fetch trending songs";
			set({ error: message });
		} finally {
			set({ isLoading: false });
		}
	},
	getLikedSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/users/likedSongs");
			set({ songs: response.data.songs });
		} catch (error) {
			const message = (error as AxiosError<{ message: string }>).response?.data?.message || "Failed to fetch liked songs";
			set({ error: message });
		} finally {
			set({ isLoading: false });
		}
	},
likeSong: async (id) => {
	set({ isLoading: true, error: null });
	try {
		const response = await axiosInstance.post(`/users/${id}`);
		const { liked } = response.data;

		// Optional: update store
		// if (songs) {
		// 	set({ songs });
		// }

		// Show appropriate toast
		if (liked) {
			toast.success("Song liked ❤️");
		} else {
			toast("Song unliked 💔", { icon: "💔" });
		}

	} catch (error) {
		const message = (error as AxiosError<{ message: string }>).response?.data?.message || "Failed to toggle like";
		set({ error: message });
		toast.error(message);
	} finally {
		set({ isLoading: false });
	}
}
,
	// friendsRequest: async (id) => {
	// 	set({ isLoading: true, error: null });
	// 	try {
	// 		const response = await axiosInstance.post(`/users/followrequest/${id}`);
	// 		set
	// 	} catch (error: any) {
	// 		set({ error: error.response.data.message });
	// 	} finally {
	// 		set({ isLoading: false });
	// 	}
	// }
	searchSongs: async (query: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/songs/search?query=${query}`);
			return response.data.songs;
		} catch (error) {
			const message = (error as AxiosError<{ message: string }>).response?.data?.message || "Failed to search songs";
			set({ error: message });
			return [];
		} finally {
			set({ isLoading: false });
		}
	},
    search: async (query: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/search?query=${query}`);
            return response.data;
        } catch (error) {
			const message = (error as AxiosError<{ message: string }>).response?.data?.message || "Failed to search";
            set({ error: message });
            return { songs: [], albums: [], users: [] };
        } finally {
            set({ isLoading: false });
        }
    },
    fetchAllSongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/songs/all");
            set({ songs: response.data.songs });
        } catch (error) {
            const message = (error as AxiosError<{ message: string }>).response?.data?.message || "Failed to fetch all songs";
            set({ error: message });
        } finally {
            set({ isLoading: false });
        }
    },
}));