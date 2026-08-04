const { Server } = require("socket.io");
const { verifyToken } = require("../shared/utils/jwtToken");

let io = null;

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
            socket.join(`user:${socket.userId}`);
        }

        socket.on("disconnect", () => {
            if (socket.userId) {
                socket.leave(`user:${socket.userId}`);
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
};
