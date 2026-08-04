import { MessageCircle, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useChat } from "../context/chatContext";
import { useAuthContext } from "../../../context/authContext";

import ChatThread from "./ChatThread";
import ConversationList from "./ConversationList";

export default function ChatWidget() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();

  const {
    widgetOpen,
    setWidgetOpen,
    unreadTotal,
    activeConversationId,
    conversations,
    openConversation,
    clearActiveConversation,
    connected,
  } = useChat();

  // The floating chat is buyer-facing only. It must never appear anywhere
  // inside the seller dashboard (/seller/*).
  if (location.pathname.startsWith("/seller")) {
    return null;
  }

  const activeConversation =
    conversations.find((c) => c._id === activeConversationId) || null;

  const handleToggle = () => {
    if (!user) {
      navigate("/login", {
        state: {
          from: window.location.pathname + window.location.search,
          message: "Please login to chat with sellers.",
        },
      });
      return;
    }

    setWidgetOpen((open) => !open);
  };

  return (
    <>
      {/* ============ FLOATING BUTTON ============ */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={widgetOpen ? "Close chat" : "Open chat"}
        className="fixed bottom-5 right-5 z-[9999] grid h-14 w-14 place-items-center rounded-full bg-green-600 text-white shadow-lg shadow-green-600/30 transition hover:bg-green-700 hover:scale-105"
      >
        {widgetOpen ? <X size={24} /> : <MessageCircle size={26} />}

        {unreadTotal > 0 && !widgetOpen && (
          <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-red-500 px-1 text-[11px] font-bold text-white">
            {unreadTotal > 9 ? "9+" : unreadTotal}
          </span>
        )}
      </button>

      {/* ============ CHAT PANEL ============ */}
      {widgetOpen && user && (
        <div className="fixed bottom-24 right-4 z-[9999] flex max-h-[calc(100vh-140px)] h-[560px] w-[calc(100vw-2rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:right-5">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">Messages</h3>
              <span
                className={`h-2 w-2 rounded-full ${
                  connected ? "bg-green-500" : "bg-gray-300"
                }`}
                title={connected ? "Connected" : "Connecting..."}
              />
            </div>

            <button
              type="button"
              onClick={() => setWidgetOpen(false)}
              aria-label="Close chat panel"
              className="grid h-8 w-8 place-items-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex min-h-0 flex-1 flex-col">
            {activeConversation ? (
              <ChatThread
                conversation={activeConversation}
                onBack={clearActiveConversation}
                className="min-h-0 flex-1"
              />
            ) : (
              <ConversationList
                onSelect={(conversation) => openConversation(conversation._id)}
                className="min-h-0 flex-1"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
