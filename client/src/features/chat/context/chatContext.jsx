import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

import { useAuthContext } from "../../../context/authContext";
import {
  connectSocket,
  disconnectSocket,
} from "../../../shared/services/socketService";

import {
  getConversations,
  getConversationMessages,
  startConversationApi,
  sendMessageApi,
  markConversationRead,
} from "../api/chatApi";

const ChatContext = createContext(null);

const toMessage = (m) => ({ ...m });

// The auth user is stored with `id` (server response), but some code
// relies on `_id` as well. Normalize to a single id.
const getUserId = (user) => user?.id || user?._id || null;

export default function ChatProvider({ children }) {
  const { token, user } = useAuthContext();
  const location = useLocation();

  // Inside the seller dashboard we must only show conversations that belong
  // to the logged-in seller's own store (never their buyer-side chats with
  // other sellers). Note: `/seller-registration` is a buyer-flow page, so it
  // must NOT count as the seller area.
  const isSellerArea =
    location.pathname === "/seller" ||
    location.pathname.startsWith("/seller/");

  const chatScope = isSellerArea ? "seller" : "buyer";

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messagesMap, setMessagesMap] = useState({});
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [typingState, setTypingState] = useState({ conversationId: null, isTyping: false });

  // Refs to avoid stale closures inside socket handlers
  const socketRef = useRef(null);
  const myIdRef = useRef(getUserId(user) || null);
  const conversationsRef = useRef(conversations);
  const activeConversationIdRef = useRef(null);
  const messagesMapRef = useRef({});

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  useEffect(() => {
    messagesMapRef.current = messagesMap;
  }, [messagesMap]);

  useEffect(() => {
    myIdRef.current = getUserId(user) || null;
  }, [user]);

  const unreadTotal = useMemo(
    () => conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0),
    [conversations]
  );

  // ==========================================
  // Fetch conversations
  // ==========================================
  const fetchConversations = useCallback(async () => {
    if (!token) {
      setConversations([]);
      return;
    }

    try {
      const response = await getConversations({ scope: chatScope });
      setConversations(response?.data || []);
    } catch (err) {
      console.error("Fetch conversations error:", err);
    }
  }, [token, chatScope]);

  const fetchConversationsRef = useRef(fetchConversations);
  useEffect(() => {
    fetchConversationsRef.current = fetchConversations;
  }, [fetchConversations]);

  // ==========================================
  // Socket event handlers
  // ==========================================

  const handleNewMessage = useCallback((payload = {}) => {
    const message = payload?.message;
    const convId = payload?.conversationId;

    if (!message || !convId) return;

    const myId = myIdRef.current;

    // Acknowledge delivery back to the server (WhatsApp double-grey-tick)
    socketRef.current?.emit("chat:delivered", {
      conversationId: convId,
      messageIds: [message._id],
    });

    // Update conversation list (bubble to top + unread + last message)
    setConversations((prev) => {
      const index = prev.findIndex((c) => c._id === convId);

      if (index === -1) {
        fetchConversationsRef.current();
        return prev;
      }

      const updated = [...prev];
      const conversation = updated[index];
      updated.splice(index, 1);

      const isMine = String(message.sender) === String(myId);

      updated.unshift({
        ...conversation,
        lastMessage:
          payload.lastMessage ||
          conversation.lastMessage || {
            text: message.text,
            sender: message.sender,
            createdAt: message.createdAt,
          },
        lastMessageAt: payload.lastMessageAt || message.createdAt,
        unreadCount: isMine
          ? conversation.unreadCount || 0
          : (conversation.unreadCount || 0) + 1,
      });

      return updated;
    });

    // Append to open conversation
    if (activeConversationIdRef.current === convId) {
      setMessagesMap((prev) => {
        const list = prev[convId] || [];

        if (list.some((m) => m._id === message._id)) return prev;

        return { ...prev, [convId]: [...list, toMessage(message)] };
      });

      // Conversation is open → instantly mark as read
      if (String(message.sender) !== String(myId)) {
        socketRef.current?.emit("chat:mark_read", { conversationId: convId });

        setConversations((prev) =>
          prev.map((c) =>
            c._id === convId ? { ...c, unreadCount: 0 } : c
          )
        );

        setMessagesMap((prev) => {
          const list = prev[convId];
          if (!list) return prev;

          const readAt = new Date().toISOString();

          return {
            ...prev,
            [convId]: list.map((m) =>
              String(m.sender) === String(myId) && !m.readAt
                ? { ...m, readAt }
                : m
            ),
          };
        });
      }
    }
  }, []);

  const handleMessageSaved = useCallback((payload = {}) => {
    const tempId = payload?.tempId;
    const message = payload?.message;

    if (!tempId || !message) return;

    const convId = message.conversation;

    setMessagesMap((prev) => {
      const list = prev[convId] || [];
      const index = list.findIndex((m) => m.tempId === tempId);

      if (index === -1) return prev;

      const next = [...list];
      next[index] = { ...toMessage(message), tempId };

      return { ...prev, [convId]: next };
    });
  }, []);

  const handleDelivered = useCallback((payload = {}) => {
    const convId = payload?.conversationId;
    const ids = new Set(payload?.messageIds || []);

    if (!convId || ids.size === 0) return;

    setMessagesMap((prev) => {
      const list = prev[convId];
      if (!list || !list.some((m) => ids.has(m._id) && !m.deliveredAt)) {
        return prev;
      }

      return {
        ...prev,
        [convId]: list.map((m) =>
          ids.has(m._id) && !m.deliveredAt
            ? { ...m, deliveredAt: payload.deliveredAt }
            : m
        ),
      };
    });
  }, []);

  const handleRead = useCallback((payload = {}) => {
    const convId = payload?.conversationId;
    const ids = new Set(payload?.messageIds || []);

    if (!convId || ids.size === 0) return;

    setMessagesMap((prev) => {
      const list = prev[convId];
      if (!list || !list.some((m) => ids.has(m._id) && !m.readAt)) {
        return prev;
      }

      return {
        ...prev,
        [convId]: list.map((m) =>
          ids.has(m._id) && !m.readAt
            ? { ...m, readAt: payload.readAt }
            : m
        ),
      };
    });
  }, []);

  const handleTyping = useCallback((payload = {}) => {
    setTypingState({
      conversationId: payload?.conversationId || null,
      isTyping: Boolean(payload?.isTyping),
    });
  }, []);

  const handlePresence = useCallback((payload = {}) => {
    const userId = payload?.userId;
    const online = Boolean(payload?.online);

    if (!userId) return;

    const myId = myIdRef.current;

    // Only the *other* participant's presence matters to me.
    if (myId && String(userId) === String(myId)) return;

    setConversations((prev) =>
      prev.map((c) => {
        const otherId = c.otherUser?._id;

        if (!otherId || String(otherId) !== String(userId)) return c;

        return {
          ...c,
          otherUser: { ...c.otherUser, online },
        };
      })
    );
  }, []);

  const handleChatError = useCallback((payload = {}) => {
    const tempId = payload?.tempId;
    const error = payload?.error;

    console.error("Chat error:", error);

    if (!tempId) return;

    setMessagesMap((prev) => {
      for (const convId of Object.keys(prev)) {
        const index = prev[convId].findIndex((m) => m.tempId === tempId);

        if (index !== -1) {
          const next = [...prev[convId]];
          next[index] = { ...next[index], failed: true };
          return { ...prev, [convId]: next };
        }
      }

      return prev;
    });
  }, []);

  // ==========================================
  // Socket lifecycle
  // ==========================================

  useEffect(() => {
    setConversations([]);
    setMessagesMap({});
    setActiveConversationId(null);
    setTypingState({ conversationId: null, isTyping: false });

    if (!token) {
      socketRef.current = null;
      setConnected(false);
      return;
    }

    const socket = connectSocket(token);
    socketRef.current = socket;
    setConnected(socket.connected);

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("chat:new_message", handleNewMessage);
    socket.on("chat:message_saved", handleMessageSaved);
    socket.on("chat:delivered", handleDelivered);
    socket.on("chat:read", handleRead);
    socket.on("chat:typing", handleTyping);
    socket.on("chat:error", handleChatError);
    socket.on("presence:update", handlePresence);

    fetchConversations();

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("chat:new_message", handleNewMessage);
      socket.off("chat:message_saved", handleMessageSaved);
      socket.off("chat:delivered", handleDelivered);
      socket.off("chat:read", handleRead);
      socket.off("chat:typing", handleTyping);
      socket.off("chat:error", handleChatError);
      socket.off("presence:update", handlePresence);

      disconnectSocket();
      socketRef.current = null;
    };
  }, [
    token,
    chatScope,
    fetchConversations,
    handleNewMessage,
    handleMessageSaved,
    handleDelivered,
    handleRead,
    handleTyping,
    handleChatError,
    handlePresence,
  ]);

  // ==========================================
  // Actions
  // ==========================================

  const openConversation = useCallback(async (conversationId) => {
    setActiveConversationId(conversationId);

    const loaded = messagesMapRef.current[conversationId];

    if (!loaded || loaded.length === 0) {
      try {
        const response = await getConversationMessages(conversationId);
        setMessagesMap((prev) => ({
          ...prev,
          [conversationId]: response?.data || [],
        }));
      } catch (err) {
        console.error("Fetch messages error:", err);
      }
    }

    // Mark as read (REST + socket)
    try {
      await markConversationRead(conversationId);
    } catch (err) {
      console.error("Mark read error:", err);
    }

    socketRef.current?.emit("chat:mark_read", { conversationId });

    setConversations((prev) =>
      prev.map((c) =>
        c._id === conversationId ? { ...c, unreadCount: 0 } : c
      )
    );

    const myId = myIdRef.current;
    const readAt = new Date().toISOString();

    setMessagesMap((prev) => {
      const list = prev[conversationId];
      if (!list) return prev;

      return {
        ...prev,
        [conversationId]: list.map((m) =>
          String(m.sender) !== String(myId) && !m.readAt
            ? { ...m, readAt }
            : m
        ),
      };
    });
  }, []);

  const clearActiveConversation = useCallback(() => {
    setActiveConversationId(null);
  }, []);

  const startConversation = useCallback(
    async ({ sellerId, productId, initialMessage }) => {
      if (!sellerId) return null;

      try {
        const response = await startConversationApi({
          sellerId,
          productId: productId || undefined,
          initialMessage: initialMessage || undefined,
        });

        const conversation = response?.data;

        if (!conversation) return null;

        setConversations((prev) => [
          conversation,
          ...prev.filter((c) => c._id !== conversation._id),
        ]);

        setWidgetOpen(true);

        await openConversation(conversation._id);

        return conversation;
      } catch (err) {
        console.error("Start conversation error:", err);
        return null;
      }
    },
    [openConversation]
  );

  const sendMessage = useCallback(async (text) => {
    const convId = activeConversationIdRef.current;
    const myId = myIdRef.current;

    const trimmed = String(text || "").trim();

    if (!convId || !myId || !trimmed) return;

    const conversation = conversationsRef.current.find(
      (c) => c._id === convId
    );

    const otherId = conversation?.otherUser?._id;

    const tempId = `temp-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const optimistic = {
      _id: tempId,
      tempId,
      conversation: convId,
      sender: myId,
      receiver: otherId,
      text: trimmed,
      deliveredAt: null,
      readAt: null,
      createdAt: new Date().toISOString(),
      pending: true,
    };

    setMessagesMap((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] || []), optimistic],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c._id === convId
          ? {
              ...c,
              lastMessage: {
                sender: myId,
                text: trimmed,
                createdAt: optimistic.createdAt,
              },
              lastMessageAt: optimistic.createdAt,
            }
          : c
      )
    );

    const socket = socketRef.current;

    if (socket?.connected) {
      socket.emit("chat:send_message", {
        tempId,
        conversationId: convId,
        text: trimmed,
      });
      return;
    }

    // REST fallback (socket unavailable)
    try {
      const response = await sendMessageApi(convId, {
        conversationId: convId,
        text: trimmed,
      });
      handleMessageSaved({ tempId, message: response?.data });
    } catch (err) {
      console.error("Send message fallback error:", err);

      setMessagesMap((prev) => ({
        ...prev,
        [convId]: prev[convId].map((m) =>
          m.tempId === tempId ? { ...m, failed: true } : m
        ),
      }));
    }
  }, [handleMessageSaved]);

  const emitTyping = useCallback((isTyping) => {
    const convId = activeConversationIdRef.current;

    if (!convId) return;

    socketRef.current?.emit("chat:typing", {
      conversationId: convId,
      isTyping,
    });
  }, []);

  const prependOlderMessages = useCallback((conversationId, older = []) => {
    setMessagesMap((prev) => {
      const list = prev[conversationId] || [];
      const existingIds = new Set(list.map((m) => m._id));
      const fresh = older.filter((m) => !existingIds.has(m._id));

      if (fresh.length === 0) return prev;

      return { ...prev, [conversationId]: [...fresh, ...list] };
    });
  }, []);

  const openWidget = useCallback(() => {
    setWidgetOpen(true);
  }, []);

  const closeWidget = useCallback(() => {
    setWidgetOpen(false);
    setActiveConversationId(null);
  }, []);

  const value = {
    conversations,
    activeConversationId,
    messagesMap,
    unreadTotal,
    widgetOpen,
    connected,
    typingState,
    openConversation,
    clearActiveConversation,
    startConversation,
    sendMessage,
    emitTyping,
    prependOlderMessages,
    openWidget,
    closeWidget,
    setWidgetOpen,
    refreshConversations: fetchConversations,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export const useChat = () => useContext(ChatContext);
