import { MessageSquare } from "lucide-react";

import { useChat } from "../context/chatContext";
import Avatar from "./Avatar";

function relativeTime(value) {
  if (!value) return "";

  const date = new Date(value);
  const diff = Date.now() - date.getTime();

  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);

  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d`;

  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
  });
}

function conversationName(conversation) {
  if (conversation.isSellerSide) {
    return (
      `${conversation.otherUser?.firstname || ""} ${conversation.otherUser?.lastname || ""}`.trim() ||
      conversation.otherUser?.email ||
      "Customer"
    );
  }

  return conversation.seller?.storeName || "Seller";
}

function conversationAvatar(conversation) {
  if (conversation.isSellerSide) return "";
  return conversation.seller?.logo || "";
}

export default function ConversationList({
  onSelect,
  emptyText = "No conversations yet.",
  className = "",
  filterQuery = "",
}) {
  const { conversations, activeConversationId } = useChat();

  const query = String(filterQuery || "").trim().toLowerCase();

  const filtered = query
    ? conversations.filter((conversation) => {
        const name = conversationName(conversation).toLowerCase();
        const product = (conversation.product?.name || "").toLowerCase();
        const text = (conversation.lastMessage?.text || "").toLowerCase();

        return (
          name.includes(query) ||
          product.includes(query) ||
          text.includes(query)
        );
      })
    : conversations;

  return (
    <div className={`flex min-h-0 flex-col ${className}`}>
      {filtered.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gray-100 text-gray-400">
            <MessageSquare size={24} />
          </span>
          <p className="mt-4 text-sm font-medium text-gray-500">
            {query ? "No matching conversations" : emptyText}
          </p>
          <p className="mt-1 max-w-[240px] text-xs text-gray-400">
            {query
              ? "Try a different name, product, or message keyword."
              : 'Open a product and tap "Chat with Seller" to start a conversation.'}
          </p>
        </div>
      ) : (
        <ul className="min-h-0 flex-1 divide-y divide-gray-50 overflow-y-auto">
          {filtered.map((conversation) => {
            const active = conversation._id === activeConversationId;
            const lastMessage = conversation.lastMessage;
            const otherOnline = Boolean(conversation.otherUser?.online);

            return (
              <li key={conversation._id}>
                <button
                  type="button"
                  onClick={() => onSelect?.(conversation)}
                  className={`
                    flex
                    w-full
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-left
                    transition
                    ${
                      active
                        ? "bg-green-50"
                        : "hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="relative shrink-0">
                    <Avatar
                      name={conversationName(conversation)}
                      src={conversationAvatar(conversation)}
                      size="md"
                    />

                    <span
                      className={`
                        absolute
                        bottom-0
                        right-0
                        h-2.5
                        w-2.5
                        rounded-full
                        border-2
                        border-white
                        ${
                          otherOnline
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }
                      `}
                      title={otherOnline ? "Online" : "Offline"}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {conversationName(conversation)}
                      </p>
                      <span className="shrink-0 text-[11px] text-gray-400">
                        {relativeTime(conversation.lastMessageAt)}
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <p
                        className={`truncate text-xs ${
                          conversation.unreadCount > 0
                            ? "font-medium text-gray-700"
                            : "text-gray-400"
                        }`}
                      >
                        {conversation.product?.name
                          ? `📦 ${conversation.product.name} — `
                          : ""}
                        {lastMessage?.text || "Say hello 👋"}
                      </p>

                      {conversation.unreadCount > 0 && (
                        <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-green-600 px-1.5 text-[11px] font-semibold text-white">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
