import { create } from "zustand";
import { useChatStore } from "./useChatStore";
import { Song } from "@/types";

interface PartyStore {
	roomId: string | null;
	isHost: boolean;
	createParty: (userId: string) => void;
	joinParty: (roomId: string, userId: string) => void;
	leaveParty: () => void;
	syncPlayer: (action: string, song: Song | null, isPlaying: boolean, currentTime: number) => void;
}

export const usePartyStore = create<PartyStore>((set, get) => ({
	roomId: null,
	isHost: false,

	createParty: (userId) => {
		const socket = useChatStore.getState().socket;
		if (!socket) return;
		socket.emit("create_party", { userId });
		
        // Remove previous listener to avoid duplicates if called multiple times
        socket.off("party_created");
        socket.on("party_created", (roomId: string) => {
			set({ roomId, isHost: true });
		});
	},

	joinParty: (roomId, userId) => {
		const socket = useChatStore.getState().socket;
		if (!socket) return;
		socket.emit("join_party", { roomId, userId });
        
        socket.off("party_joined");
		socket.on("party_joined", () => {
			set({ roomId, isHost: false });
		});
        
        socket.off("party_error");
		socket.on("party_error", (msg: string) => {
			console.error(msg);
            // Ideally show a toast here
		});
	},

	leaveParty: () => {
		set({ roomId: null, isHost: false });
	},

	syncPlayer: (action, song, isPlaying, currentTime) => {
		const { roomId, isHost } = get();
		if (!roomId || !isHost) return;

		const socket = useChatStore.getState().socket;
		if (!socket) return;

		socket.emit("player_action", { roomId, action, song, isPlaying, currentTime });
	},
}));
