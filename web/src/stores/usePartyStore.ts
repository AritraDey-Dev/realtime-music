import { create } from "zustand";
import { useChatStore } from "./useChatStore";
import { Song } from "@/types";

interface VoteItem {
    song: Song;
    votes: string[]; // userIds
}

interface PartyStore {
	roomId: string | null;
	isHost: boolean;
    connectedUsers: string[];
    votingQueue: VoteItem[];
	createParty: (userId: string) => void;
	joinParty: (roomId: string, userId: string) => void;
	leaveParty: () => void;
	syncPlayer: (action: string, song: Song | null, isPlaying: boolean, currentTime: number) => void;
    addToVote: (song: Song) => void;
    voteSong: (songId: string, userId: string) => void;
}

export const usePartyStore = create<PartyStore>((set, get) => ({
	roomId: null,
	isHost: false,
    connectedUsers: [],
    votingQueue: [],

	createParty: (userId) => {
		const socket = useChatStore.getState().socket;
		if (!socket) return;
		socket.emit("create_party", { userId });
		
        // Remove previous listener to avoid duplicates if called multiple times
        socket.off("party_created");
        socket.on("party_created", (roomId: string) => {
			set({ roomId, isHost: true, connectedUsers: [userId] });
		});
	},

	joinParty: (roomId, userId) => {
		const socket = useChatStore.getState().socket;
		if (!socket) return;
		socket.emit("join_party", { roomId, userId });
        
        socket.off("party_joined");
		socket.on("party_joined", ({ roomId, hostId }) => {
			set({ roomId, isHost: hostId === userId });
		});

        socket.off("party_sync");
        socket.on("party_sync", (data: { users: string[], votingQueue: VoteItem[] }) => {
            set({ connectedUsers: data.users, votingQueue: data.votingQueue });
        });

        socket.off("party_users_updated");
        socket.on("party_users_updated", (users: string[]) => {
            set({ connectedUsers: users });
        });

        socket.off("party_vote_update");
        socket.on("party_vote_update", (votingQueue: VoteItem[]) => {
            set({ votingQueue });
        });
        
        socket.off("party_error");
		socket.on("party_error", (msg: string) => {
			console.error(msg);
            // Ideally show a toast here
		});
	},

	leaveParty: () => {
		set({ roomId: null, isHost: false, connectedUsers: [], votingQueue: [] });
	},

	syncPlayer: (action, song, isPlaying, currentTime) => {
		const { roomId, isHost } = get();
		if (!roomId || !isHost) return;

		const socket = useChatStore.getState().socket;
		if (!socket) return;

		socket.emit("player_action", { roomId, action, song, isPlaying, currentTime });
	},

    addToVote: (song) => {
        const { roomId } = get();
        if (!roomId) return;
        const socket = useChatStore.getState().socket;
        socket?.emit("add_to_vote", { roomId, song });
    },

    voteSong: (songId, userId) => {
        const { roomId } = get();
        if (!roomId) return;
        const socket = useChatStore.getState().socket;
        socket?.emit("vote_song", { roomId, songId, userId });
    }
}));
