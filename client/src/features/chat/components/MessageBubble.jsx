import { useState } from "react";
import { Check, CheckCheck, Clock, Pencil, Trash2 } from "lucide-react";

function formatTime(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * WhatsApp-style message bubble with delivery ticks:
 *  - pending           -> clock
 *  - sent              -> single grey tick
 *  - delivered         -> double grey tick
 *  - read              -> double blue tick
 *  - edited            -> "edited" label
 *  - deleted           -> "This message was deleted" placeholder
 *
 * Own messages expose hover actions: edit + delete for everyone.
 */
export default function MessageBubble({ message, isMine, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const pending = message.pending;
  const delivered = Boolean(message.deliveredAt);
  const read = Boolean(message.readAt);
  const edited = Boolean(message.editedAt);
  const deleted = Boolean(message.deletedAt);

  if (deleted) {
    return (
      <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
        <div
          className={`
            max-w-[78%]
            rounded-2xl
            px-3.5
            py-2
            ${isMine ? "rounded-br-md bg-green-50" : "rounded-bl-md bg-gray-100"}
          `}
        >
          <p className="text-sm italic text-gray-400">
            This message was deleted
          </p>

          <div
            className={`mt-1 flex items-center justify-end gap-1 ${
              isMine ? "text-gray-400" : "text-gray-400"
            }`}
          >
            <span className="text-[10px] leading-none">
              {formatTime(message.createdAt)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const handleEditClick = () => {
    setConfirmDelete(false);
    onEdit?.(message);
  };

  const handleDeleteClick = () => {
    setConfirmDelete(false);
    onDelete?.(message);
  };

  return (
    <div className={`group flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div className="relative max-w-[78%]">
        {/* Hover actions for own messages */}
        {isMine && (
          <div className="absolute -top-6 right-0 flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleEditClick}
              aria-label="Edit message"
              className="grid h-6 w-6 place-items-center rounded-full bg-white text-gray-500 shadow-sm transition hover:text-green-700 hover:shadow"
            >
              <Pencil size={12} />
            </button>

            <button
              type="button"
              onClick={() => setConfirmDelete((v) => !v)}
              aria-label="Delete message"
              className="grid h-6 w-6 place-items-center rounded-full bg-white text-gray-500 shadow-sm transition hover:text-red-600 hover:shadow"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}

        {confirmDelete && (
          <div className="absolute right-0 top-1 z-10 mb-1 flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-2 py-1.5 shadow-lg">
            <span className="text-[11px] font-medium text-gray-600">
              Delete for everyone?
            </span>
            <button
              type="button"
              onClick={handleDeleteClick}
              className="rounded-lg bg-red-600 px-2 py-1 text-[11px] font-semibold text-white transition hover:bg-red-700"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded-lg px-2 py-1 text-[11px] font-medium text-gray-500 transition hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        )}

        <div
          className={`
            rounded-2xl
            px-3.5
            py-2
            shadow-sm
            ${
              isMine
                ? `rounded-br-md bg-green-600 text-white shadow-green-600/20`
                : "rounded-bl-md border border-gray-100 bg-white text-gray-800"
            }
          `}
        >
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message.text}
          </p>

          <div
            className={`
              mt-1
              flex
              items-center
              justify-end
              gap-1
              ${isMine ? "text-white/80" : "text-gray-400"}
            `}
          >
            {edited && (
              <span className="text-[10px] leading-none">edited</span>
            )}

            <span className="text-[10px] leading-none">
              {formatTime(message.createdAt)}
            </span>

            {isMine && (
              <>
                {pending ? (
                  <Clock size={13} className="text-white/70" />
                ) : read ? (
                  <CheckCheck size={14} className="text-sky-300" />
                ) : delivered ? (
                  <CheckCheck size={14} />
                ) : (
                  <Check size={14} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
