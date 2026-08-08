import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, Package, Send, X } from "lucide-react";

import { useAuthContext } from "../../../context/authContext";
import { useChat } from "../context/chatContext";
import { getConversationMessages } from "../api/chatApi";

import Avatar from "./Avatar";
import MessageBubble from "./MessageBubble";

const PAGE_SIZE = 30;

function formatDayLabel(value) {
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(date, today)) return "Today";
  if (sameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString([], {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

export default function ChatThread({
  conversation,
  onBack,
  className = "",
}) {
  const { user } = useAuthContext();
  const {
    messagesMap,
    sendMessage,
    editMessage,
    deleteMessage,
    emitTyping,
    typingState,
    prependOlderMessages,
  } = useChat();

  const [draft, setDraft] = useState("");
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasOlder, setHasOlder] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState("");

  const bottomRef = useRef(null);
  const typingTimerRef = useRef(null);

  const myId = user?.id || user?._id;
  const conversationId = conversation?._id;

  const messages = useMemo(
    () => messagesMap[conversationId] || [],
    [messagesMap, conversationId]
  );

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [conversationId, messages.length]);

  // Hide typing indicator when switching conversation
  useEffect(() => {
    setEditingId(null);
    setEditDraft("");

    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [conversationId]);

  // Detect older messages on first load
  useEffect(() => {
    setHasOlder(messages.length >= PAGE_SIZE);
  }, [messages.length]);

  const loadOlder = async () => {
    if (!conversationId || loadingOlder) return;

    try {
      setLoadingOlder(true);

      const oldest = messages[0]?.createdAt;

      const response = await getConversationMessages(conversationId, {
        before: oldest,
        limit: PAGE_SIZE,
      });

      const older = response?.data || [];

      setHasOlder(older.length >= PAGE_SIZE);

      prependOlderMessages(conversationId, older);
    } catch (err) {
      console.error("Load older messages error:", err);
    } finally {
      setLoadingOlder(false);
    }
  };

  const handleTyping = (value) => {
    emitTyping(value);

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = setTimeout(() => {
      emitTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    const text = draft.trim();

    if (!text) return;

    sendMessage(text);
    setDraft("");
    emitTyping(false);

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStartEdit = (message) => {
    setEditingId(message._id);
    setEditDraft(message.text);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditDraft("");
  };

  const handleSaveEdit = () => {
    const text = editDraft.trim();

    if (!editingId || !text) return;

    editMessage(editingId, text);
    handleCancelEdit();
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }

    if (e.key === "Escape") {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const otherName = useMemo(() => {
    if (!conversation) return "";

    return conversation.isSellerSide
      ? `${conversation.otherUser?.firstname || ""} ${conversation.otherUser?.lastname || ""}`.trim() || "Customer"
      : conversation.seller?.storeName || "Seller";
  }, [conversation]);

  const otherAvatar = conversation?.isSellerSide
    ? ""
    : conversation?.seller?.logo || "";

  const otherIsTyping =
    typingState.conversationId === conversationId && typingState.isTyping;

  const otherOnline = Boolean(conversation?.otherUser?.online);

  const groupedMessages = useMemo(() => {
    const result = [];

    let lastDay = null;

    for (const message of messages) {
      const day = message.createdAt
        ? new Date(message.createdAt).toDateString()
        : null;

      if (day !== lastDay) {
        result.push({ type: "day", id: `day-${day}`, label: formatDayLabel(message.createdAt) });
        lastDay = day;
      }

      result.push({ type: "message", message });
    }

    return result;
  }, [messages]);

  if (!conversation) return null;

  return (
    <div className={`flex min-h-0 flex-col ${className}`}>
      {/* ============ HEADER ============ */}
      <div className="flex shrink-0 items-center gap-3 border-b border-gray-100 bg-white px-4 py-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to conversations"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <Avatar name={otherName} src={otherAvatar} size="md" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">
            {otherName}
          </p>
          <p
            className={`flex items-center gap-1.5 truncate text-xs ${
              otherIsTyping
                ? "font-medium text-green-700"
                : otherOnline
                  ? "text-green-600"
                  : "text-gray-400"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                otherIsTyping
                  ? "bg-green-500"
                  : otherOnline
                    ? "bg-green-500"
                    : "bg-gray-300"
              }`}
            />
            {otherIsTyping
              ? "typing..."
              : otherOnline
                ? "Online"
                : "Offline"}
          </p>
        </div>
      </div>

      {/* ============ PRODUCT CONTEXT ============ */}
      {conversation.product && (
        <div className="flex shrink-0 items-center gap-3 border-b border-green-100 bg-green-50/60 px-4 py-2.5">
          {conversation.product.image ? (
            <img
              src={conversation.product.image}
              alt={conversation.product.name}
              className="h-9 w-9 shrink-0 rounded-lg border border-green-200 object-cover"
            />
          ) : (
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-green-200 bg-white text-green-700">
              <Package size={16} />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-green-900">
              {conversation.product.name}
            </p>
            <p className="text-[11px] text-green-700">
              Inquiring about this product
            </p>
          </div>
        </div>
      )}

      {/* ============ MESSAGES ============ */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 px-4 py-4">
        {hasOlder && (
          <div className="mb-3 flex justify-center">
            <button
              type="button"
              onClick={loadOlder}
              disabled={loadingOlder}
              className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-600 transition hover:border-green-300 hover:text-green-700 disabled:opacity-60"
            >
              {loadingOlder ? "Loading..." : "Load earlier messages"}
            </button>
          </div>
        )}

        {groupedMessages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-gray-500">
              No messages yet
            </p>
            <p className="mt-1 max-w-[240px] text-xs text-gray-400">
              Say hello and start the conversation about this product.
            </p>
          </div>
        )}

        {groupedMessages.map((item) => {
          if (item.type === "day") {
            return (
              <div key={item.id} className="my-3 flex justify-center">
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-gray-500 shadow-sm">
                  {item.label}
                </span>
              </div>
            );
          }

          const message = item.message;
          const isMine = String(message.sender) === String(myId);
          const isEditing = editingId === message._id;

          return (
            <div key={message._id} className="mb-2">
              {isMine && isEditing ? (
                <div className="flex justify-end">
                  <div className="w-full max-w-[85%] rounded-2xl border border-green-200 bg-white p-2 shadow-sm">
                    <p className="px-1 pb-1.5 text-[10px] font-semibold uppercase tracking-wide text-green-700">
                      Edit message
                    </p>

                    <textarea
                      rows={2}
                      autoFocus
                      value={editDraft}
                      onChange={(e) => setEditDraft(e.target.value)}
                      onKeyDown={handleEditKeyDown}
                      className="w-full resize-none rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none ring-1 ring-gray-200 focus:ring-green-400"
                    />

                    <div className="mt-1.5 flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        aria-label="Cancel edit"
                        className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 transition hover:bg-gray-100"
                      >
                        <X size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        disabled={!editDraft.trim()}
                        aria-label="Save edit"
                        className="grid h-8 w-8 place-items-center rounded-lg bg-green-600 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Check size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <MessageBubble
                  message={message}
                  isMine={isMine}
                  onEdit={handleStartEdit}
                  onDelete={(msg) => deleteMessage(msg._id)}
                />
              )}
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* ============ INPUT ============ */}
      <div className="shrink-0 border-t border-gray-100 bg-white px-3 py-3">
        <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-1.5 transition focus-within:border-green-400 focus-within:bg-white">
          <textarea
            rows={1}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              handleTyping(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="max-h-28 min-h-[38px] flex-1 resize-none bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-gray-400"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!draft.trim()}
            aria-label="Send message"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-green-600 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
