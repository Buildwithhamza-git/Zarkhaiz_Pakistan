import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let socket = null;
let refCount = 0;

/**
 * Connect the shared socket (reference-counted so multiple hook instances
 * reuse a single connection). Reconnects with a new token when it changes.
 */
export const connectSocket = (token) => {
  if (!token) {
    return null;
  }

  if (socket) {
    if (socket.auth?.token !== token) {
      socket.disconnect();
      socket = null;
      refCount = 0;
    } else {
      refCount += 1;
      return socket;
    }
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
  });

  refCount = 1;

  return socket;
};

export const disconnectSocket = () => {
  refCount = Math.max(0, refCount - 1);

  if (refCount === 0 && socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
