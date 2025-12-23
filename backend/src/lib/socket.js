import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: "http://localhost:5173",
			credentials: true,
		},
	});

	const userSockets = new Map(); // { userId: socketId}
	const userActivities = new Map(); // {userId: activity}
    const parties = new Map(); // { roomId: { hostId, users: Set<userId>, currentSong, isPlaying, currentTime, votingQueue: [{song, votes: Set<userId>}] } }

	io.on("connection", (socket) => {
		console.log("New socket connection", socket.id);
		socket.on("user_connected", (userId) => {
			userSockets.set(userId, socket.id);
			userActivities.set(userId, "Idle");

			// broadcast to all connected sockets that this user just logged in
			io.emit("user_connected", userId);

			socket.emit("users_online", Array.from(userSockets.keys()));

			io.emit("activities", Array.from(userActivities.entries()));
		});

		socket.on("update_activity", ({ userId, activity }) => {
			console.log("activity updated", userId, activity);
			userActivities.set(userId, activity);
			io.emit("activity_updated", { userId, activity });
		});

        // Party Mode Events
        socket.on("create_party", ({ userId }) => {
            const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
            parties.set(roomId, {
                hostId: userId,
                users: new Set([userId]),
                currentSong: null,
                isPlaying: false,
                currentTime: 0,
                votingQueue: []
            });
            
            socket.join(roomId);
            socket.emit("party_created", roomId);
            console.log(`Party created: ${roomId} by ${userId}`);
        });

        socket.on("join_party", ({ roomId, userId }) => {
            const party = parties.get(roomId);
            if (party) {
                party.users.add(userId);
                socket.join(roomId);
                socket.emit("party_joined", { roomId, hostId: party.hostId });
                
                // Sync new user with current state
                socket.emit("party_sync", {
                    users: Array.from(party.users),
                    votingQueue: party.votingQueue.map(item => ({...item, votes: Array.from(item.votes)}))
                });

                if (party.currentSong) {
                    socket.emit("player_sync", {
                        action: "sync",
                        song: party.currentSong,
                        isPlaying: party.isPlaying,
                        currentTime: party.currentTime
                    });
                }
                
                // Notify others
                io.to(roomId).emit("party_users_updated", Array.from(party.users));

                console.log(`User ${userId} joined party ${roomId}`);
            } else {
                socket.emit("party_error", "Party not found");
            }
        });

        socket.on("player_action", ({ roomId, action, song, isPlaying, currentTime }) => {
            const party = parties.get(roomId);
            if (party) {
                // Update server state
                if (song) party.currentSong = song;
                if (typeof isPlaying === 'boolean') party.isPlaying = isPlaying;
                if (currentTime) party.currentTime = currentTime;

                // Broadcast to everyone else in the room
                socket.to(roomId).emit("player_sync", {
                    action,
                    song,
                    isPlaying,
                    currentTime
                });
            }
        });

        socket.on("add_to_vote", ({ roomId, song }) => {
            const party = parties.get(roomId);
            if (party) {
                // Check if song already exists
                if (!party.votingQueue.some(item => item.song._id === song._id)) {
                    party.votingQueue.push({ song, votes: new Set() });
                    io.to(roomId).emit("party_vote_update", party.votingQueue.map(item => ({...item, votes: Array.from(item.votes)})));
                }
            }
        });

        socket.on("vote_song", ({ roomId, songId, userId }) => {
            const party = parties.get(roomId);
            if (party) {
                const item = party.votingQueue.find(i => i.song._id === songId);
                if (item) {
                    if (item.votes.has(userId)) {
                        item.votes.delete(userId);
                    } else {
                        item.votes.add(userId);
                    }
                    // Sort by votes
                    party.votingQueue.sort((a, b) => b.votes.size - a.votes.size);
                    
                    io.to(roomId).emit("party_vote_update", party.votingQueue.map(item => ({...item, votes: Array.from(item.votes)})));
                }
            }
        });

        socket.on("remove_from_vote", ({ roomId, songId }) => {
            const party = parties.get(roomId);
            if (party) {
                const index = party.votingQueue.findIndex(i => i.song._id === songId);
                if (index !== -1) {
                    party.votingQueue.splice(index, 1);
                    io.to(roomId).emit("party_vote_update", party.votingQueue.map(item => ({...item, votes: Array.from(item.votes)})));
                }
            }
        });

		socket.on("send_message", async (data) => {
			try {
				const { senderId, receiverId, content } = data;

				const message = await Message.create({
					senderId,
					receiverId,
					content,
				});

				// send to receiver in realtime, if they're online
				const receiverSocketId = userSockets.get(receiverId);
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("receive_message", message);
				}

				socket.emit("message_sent", message);
			} catch (error) {
				console.error("Message error:", error);
				socket.emit("message_error", error.message);
			}
		});

		socket.on("disconnect", () => {
			let disconnectedUserId;
			for (const [userId, socketId] of userSockets.entries()) {
				// find disconnected user
				if (socketId === socket.id) {
					disconnectedUserId = userId;
					userSockets.delete(userId);
					userActivities.delete(userId);
					break;
				}
			}
			if (disconnectedUserId) {
				io.emit("user_disconnected", disconnectedUserId);
			}
		});
	});
};