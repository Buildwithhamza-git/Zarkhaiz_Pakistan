import { useCallback, useEffect, useRef, useState } from "react";

import { useAuthContext } from "../../../context/authContext";

import {
  getNotifications,
  getUnreadCount,
  markNotificationRead as markReadApi,
  markAllNotificationsRead as markAllReadApi,
} from "../api/notificationApi";

import {
  connectSocket,
  disconnectSocket,
} from "../../../shared/services/socketService";

const POLL_INTERVAL = 60000;

export function useNotifications() {
  const { token } = useAuthContext();

  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const pollRef = useRef(null);

  const refresh = useCallback(async () => {
    if (!token) {
      setItems([]);
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);

      const [listRes, countRes] = await Promise.all([
        getNotifications({ limit: 15 }),
        getUnreadCount(),
      ]);

      setItems(listRes?.data?.items || []);
      setUnreadCount(countRes?.data?.count || 0);
    } catch (error) {
      console.error("Fetch notifications error:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const markRead = useCallback(
    async (notificationId) => {
      try {
        await markReadApi(notificationId);

        setItems((prev) =>
          prev.map((n) =>
            n._id === notificationId ? { ...n, read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Mark notification read error:", error);
      }
    },
    []
  );

  const markAllRead = useCallback(async () => {
    try {
      await markAllReadApi();

      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Mark all notifications read error:", error);
    }
  }, []);

  useEffect(() => {
    refresh();

    let socket = null;

    if (token) {
      socket = connectSocket(token);

      socket.on("notification:new", refresh);

      pollRef.current = setInterval(refresh, POLL_INTERVAL);
    }

    return () => {
      if (socket) {
        socket.off("notification:new", refresh);
      }

      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }

      disconnectSocket();
    };
  }, [token, refresh]);

  return {
    items,
    unreadCount,
    loading,
    refresh,
    markRead,
    markAllRead,
  };
}
