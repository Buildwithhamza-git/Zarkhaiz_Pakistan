import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Loader2 } from "lucide-react";

import { useAuthContext } from "../../../../context/authContext";
import { useNotifications } from "../../../notification/hooks/useNotifications";
import { formatDateTime } from "../../../order/utils/orderDisplay";

export default function NotificationButton() {
  const navigate = useNavigate();

  const { seller } = useAuthContext();

  const { items, unreadCount, loading, markRead, markAllRead } =
    useNotifications();

  const [open, setOpen] = useState(false);

  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleOpenNotification = (notification) => {
    if (!notification.read) {
      markRead(notification._id);
    }

    setOpen(false);

    const orderId = notification.data?.orderId;

    if (orderId) {
      navigate(`/orders/${orderId}`);
      return;
    }

    const productId = notification.data?.productId;

    if (notification.type === "review") {
      if (seller) {
        navigate("/seller/reviews");
      } else if (productId) {
        navigate(`/products/${productId}`);
      }
      return;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-green-50"
        aria-label="Notifications"
      >
        <Bell size={22} className="text-gray-700" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl sm:w-96">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-bold text-gray-900">
              Notifications
            </h3>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-xs font-semibold text-green-700 transition hover:text-green-800"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && items.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin text-green-700" />
              </div>
            ) : items.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <p className="text-sm text-gray-500">No notifications yet.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {items.map((notification) => (
                  <li key={notification._id}>
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenNotification(notification)
                      }
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-gray-50 ${
                        notification.read ? "" : "bg-green-50/60"
                      }`}
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          notification.read ? "bg-gray-200" : "bg-green-600"
                        }`}
                      />

                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-gray-900">
                          {notification.title}
                        </span>

                        <span className="mt-0.5 block text-xs text-gray-500">
                          {notification.message}
                        </span>

                        <span className="mt-1 block text-[11px] text-gray-400">
                          {formatDateTime(notification.createdAt)}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
