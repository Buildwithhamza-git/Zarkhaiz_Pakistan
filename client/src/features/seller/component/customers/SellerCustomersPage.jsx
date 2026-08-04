import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Users,
  ArrowRight,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useSellerContext } from "../../../../context/sellerContext";
import { useChat } from "../../../chat/context/chatContext";
import { getCustomers } from "../../../chat/api/chatApi";
import Avatar from "../../../chat/components/Avatar";

function timeAgo(value) {
  if (!value) return "";

  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  if (minutes < 10080) return `${Math.floor(minutes / 1440)}d ago`;

  return new Date(value).toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SellerCustomersPage() {
  const navigate = useNavigate();
  const { isApproved } = useSellerContext();
  const { openConversation } = useChat();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isApproved) return;

    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getCustomers();
        if (mounted) setCustomers(response?.data || []);
      } catch (err) {
        if (mounted) setError(err?.message || "Failed to load customers.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [isApproved]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return customers;

    return customers.filter((row) => {
      const c = row.customer || {};
      return [c.firstname, c.lastname, c.email, c.username, c.phone]
        .filter(Boolean)
        .some((part) => String(part).toLowerCase().includes(q));
    });
  }, [customers, query]);

  const totalUnread = customers.reduce(
    (sum, row) => sum + (row.sellerUnread || 0),
    0
  );

  const handleOpenChat = (row) => {
    openConversation(row.conversationId);
    navigate("/seller/messages", { state: { customer: row } });
  };

  if (!isApproved) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-500">
          You are not authorized to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-sm text-gray-500">
            People who have contacted you through chat.
          </p>
        </div>

        {totalUnread > 0 && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            {totalUnread} unread replies
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <Users size={20} />
            </span>
            <div>
              <p className="text-xs font-medium text-gray-500">
                Total Customers
              </p>
              <p className="text-xl font-bold text-gray-900">
                {customers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <MessageSquare size={20} />
            </span>
            <div>
              <p className="text-xs font-medium text-gray-500">
                Conversations
              </p>
              <p className="text-xl font-bold text-gray-900">
                {customers.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
              <Mail size={20} />
            </span>
            <div>
              <p className="text-xs font-medium text-gray-500">
                Unread Messages
              </p>
              <p className="text-xl font-bold text-gray-900">{totalUnread}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm focus-within:border-green-400">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email or phone..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Customers list */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin text-green-700" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-sm">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-green-50 text-green-600">
            <Users size={26} />
          </span>
          <p className="mt-4 text-sm font-medium text-gray-600">
            {customers.length === 0
              ? "No customers yet."
              : "No customers match your search."}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {customers.length === 0
              ? "When customers message you about products, they will appear here."
              : "Try a different name, email or phone."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((row) => {
            const c = row.customer || {};
            const fullName =
              [c.firstname, c.lastname].filter(Boolean).join(" ").trim() ||
              c.username ||
              "Customer";

            return (
              <div
                key={row.conversationId}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-200 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <Avatar name={fullName} size="lg" />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {fullName}
                      </p>
                      {row.sellerUnread > 0 && (
                        <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
                          {row.sellerUnread}
                        </span>
                      )}
                    </div>

                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {c.email || "No email"}
                    </p>

                    {c.phone && (
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-gray-500">
                        <Phone size={11} />
                        {c.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Product context */}
                {row.product ? (
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50/70 px-3 py-2">
                    {row.product.image ? (
                      <img
                        src={row.product.image}
                        alt={row.product.name}
                        className="h-8 w-8 shrink-0 rounded-lg border border-green-200 object-cover"
                      />
                    ) : (
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-green-200 bg-white text-green-700">
                        <Package size={14} />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="text-[11px] text-green-700">Inquired about</p>
                      <p className="truncate text-xs font-semibold text-green-900">
                        {row.product.name}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-gray-200 bg-white text-gray-500">
                      <MessageSquare size={14} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-500">General chat</p>
                      <p className="truncate text-xs text-gray-600">
                        No product attached
                      </p>
                    </div>
                  </div>
                )}

                {/* Activity */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                  <span>
                    {row.messageCount || 0} message
                    {row.messageCount === 1 ? "" : "s"}
                  </span>
                  <span>Last seen {timeAgo(row.lastMessageAt)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenChat(row)}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
                >
                  View Chat
                  <ArrowRight size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
