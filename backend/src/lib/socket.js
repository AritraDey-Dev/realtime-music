import { Server } from 'socket.io';
import { Message } from '../models/message.model.js';

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true,
        }
    })

    const userSocket = new Map();
    const userActivites = new Map();

    // io -->server
    // socket --> client

    io.on('connection', (socket) => {
        socket.on("user_connected", ({ userId }) => {
            userSocket.set(userId, socket.id);
            userActivites.set(socket.id, "Idle");
            io.emit("user_connected", { userId });
            socket.emit("users_online",Array.from(userSocket.keys()));
            io.emit("user_activities", Array.from(userActivites.entries()));

        })
        socket.on("update_activity", ({ userId, activity }) => {
            userActivites.set(userSocket.get(userId), activity);
            io.emit("user_activitiy",{userId, activity});
        })

        socket.on("send_message",async(data)=>{
            try{
                const {senderId, receiverId, message} = data;
                const newMessage = await Message.create({
                    sender: senderId,
                    receiver: receiverId,
                    message
                });
                const receiverSocketId = userSocket.get(receiverId);
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("receive_message", newMessage);
                }
                socket.emit("message_sent", newMessage);
            }catch(error){
                console.error("error in sending message", error);
                socket.emit("message_error", {message: "Internal server error"});
            }
        })

        socket.on("disconnect", () => {
            let disconnectedUserId;
            for( const [userId,socketId] of userSocket.entries()){
                if(socketId === socket.id){
                    disconnectedUserId = userId;
                    userSocket.delete(userId);
                    userActivites.delete(socket.id);
                    break;
                }

            }
            if(disconnectedUserId){
                io.emit("user_disconnected", { userId: disconnectedUserId });
            }
        })

    });

}