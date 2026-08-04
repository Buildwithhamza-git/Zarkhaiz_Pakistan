const { Server } = require("socket.io");
const { verifyToken } = require("../shared/utils/jwtToken");

let io = null;

// Users currently connected (user id -> number of active sockets).
// A user may have several tabs/sockets open, so use a counter.
const onlineUserSockets = new Map();

const isUserOnline = (userId) => {
    const id = String(userId || "");

    return Boolean(id && (onlineUserSockets.get(id) || 0) > 0);
};

const getOnlineUserIds = () => [...onlineUserSockets.keys()];

/**
 * Broadcast a presence update to every conversation partner of `userId`.
 */
const notifyPresence = async (userId, online) => {
    if (!io || !userId) {
        return;
    }

    try {
        const chatService = require("../features/chat/chat.service");
        const partnerIds = await chatService.getConversationPartnerIds(userId);

        for (const partnerId of partnerIds) {
            io.to(`user:${partnerId}`).emit("presence:update", {
                userId,
                online,
            });
        }
    } catch (error) {
        console.error("presence broadcast error:", error);
    }
};

/**
 * Mark every message sent to this user as delivered (they are online now)
 * and notify the senders so their ticks turn to double-grey.
 */
const markMessagesDeliveredOnConnect = async (userId) => {
    try {
        const chatService = require("../features/chat/chat.service");
        await chatService.markDeliveredOnConnectService(userId);
    } catch (error) {
        console.error("delivered-on-connect error:", error);
    }
};

/**
 * Attach Socket.IO to the HTTP server.
 * Clients authenticate via `socket.handshake.auth.token` and are joined
 * into a private room: `user:<userId>`.
 */
const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PATCH", "DELETE"],
        },
    });

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(new Error("Authentication required."));
            }

            const decoded = verifyToken(token);

            if (!decoded?.userId) {
                return next(new Error("Invalid token."));
            }

            socket.userId = decoded.userId;
            next();
        } catch (error) {
            return next(new Error("Invalid or expired token."));
        }
    });

    io.on("connection", (socket) => {
        if (socket.userId) {
            const id = String(socket.userId);

            socket.join(`user:${id}`);

            onlineUserSockets.set(id, (onlineUserSockets.get(id) || 0) + 1);

            // Mark messages that arrived while this user was offline as
            // delivered (online -> double grey tick) and broadcast presence.
            markMessagesDeliveredOnConnect(id);
            notifyPresence(id, true);
        }

        // Chat events (lazy require avoids circular deps at boot)
        const { registerChatHandlers } = require("../features/chat/chat.socket");
        registerChatHandlers(socket);

        socket.on("disconnect", () => {
            if (socket.userId) {
                const id = String(socket.userId);

                socket.leave(`user:${id}`);

                const remaining = (onlineUserSockets.get(id) || 1) - 1;

                if (remaining <= 0) {
                    onlineUserSockets.delete(id);
                    notifyPresence(id, false);
                } else {
                    onlineUserSockets.set(id, remaining);
                }
            }
        });
    });

    return io;
};

/**
 * Emit an event to a single user's room.
 */
const emitToUser = (userId, event, payload) => {
    if (io && userId) {
        io.to(`user:${userId}`).emit(event, payload);
    }
};

/**
 * Emit an event to many users' rooms.
 */
const emitToUsers = (userIds, event, payload) => {
    if (!io || !userIds?.length) {
        return;
    }

    for (const userId of userIds) {
        if (userId) {
            io.to(`user:${userId}`).emit(event, payload);
        }
    }
};

module.exports = {
    initSocket,
    emitToUser,
    emitToUsers,
    getIO: () => io,
    isUserOnline,
    getOnlineUserIds,
};
