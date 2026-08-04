import { useEffect, useState } from "react";
import { MessageSquare, Search, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useChat } from "../../../chat/context/chatContext";
import ChatThread from "../../../chat/components/ChatThread";
import ConversationList from "../../../chat/components/ConversationList";

function buildDeepLinkConversation(customerRow) {
  if (!customerRow?.conversationId) return null;

  const c = customerRow.customer || {};

  return {
    _id: customerRow.conversationId,
    isSellerSide: true,
    otherUser: {
      _id: c._id,
      firstname: c.firstname || "",
      lastname: c.lastname || "",
      email: c.email || "",
      username: c.username || "",
    },
    seller: null,
    product: customerRow.product || null,
    lastMessage: customerRow.lastMessage || null,
    lastMessageAt: customerRow.lastMessageAt,
    unreadCount: customerRow.sellerUnread || 0,
  };
}

export default function SellerMessagesPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [deepLink] = useState(() => location.state?.customer || null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    conversations,
    activeConversationId,
    openConversation,
    clearActiveConversation,
    unreadTotal,
  } = useChat();

  // Open the conversation deep-linked from the Customers page
  useEffect(() => {
    if (!deepLink?.conversationId) return;

    openConversation(deepLink.conversationId);

    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [deepLink, openConversation, navigate, location.pathname]);

  const activeConversation =
    conversations.find((c) => c._id === activeConversationId) ||
    (deepLink && activeConversationId === deepLink.conversationId
      ? buildDeepLinkConversation(deepLink)
      : null);

  const leftVisible = activeConversationId ? "hidden md:flex" : "flex";
  const rightVisible = activeConversationId ? "flex" : "hidden md:flex";

  return (
    <div className="flex h-[calc(100vh-140px)] min-h-[420px] flex-col">
      {/* Page header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Messages
          </h1>
          <p className="text-sm text-gray-500">
            Respond to customer inquiries in real time.
          </p>
        </div>

        {unreadTotal > 0 && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            {unreadTotal} unread
          </span>
        )}
      </div>

      {/* Chat area */}
      <div className="flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* ============ LEFT: CONVERSATION LIST ============ */}
        <div
          className={`${leftVisible} min-h-0 w-full flex-col border-r border-gray-100 md:w-80 lg:w-96`}
        >
          <div className="shrink-0 border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
              <Search size={15} className="shrink-0 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customers, products, messages..."
                className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="shrink-0 text-gray-400 transition hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          <ConversationList
            onSelect={(conversation) =>
              openConversation(conversation._id)
            }
            emptyText="No customer conversations yet."
            filterQuery={searchQuery}
            className="min-h-0 flex-1"
          />
        </div>

        {/* ============ RIGHT: THREAD / EMPTY ============ */}
        <div className={`${rightVisible} min-h-0 flex-1 flex-col`}>
          {activeConversation ? (
            <ChatThread
              conversation={activeConversation}
              onBack={clearActiveConversation}
              className="min-h-0 h-full"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-green-50 text-green-600">
                <MessageSquare size={28} />
              </span>
              <h3 className="mt-4 text-base font-semibold text-gray-800">
                Select a conversation
              </h3>
              <p className="mt-1 max-w-xs text-sm text-gray-400">
                Choose a customer from the list to view their messages and
                reply in real time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
