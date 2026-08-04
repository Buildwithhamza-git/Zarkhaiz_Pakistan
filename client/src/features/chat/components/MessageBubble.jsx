import { Check, CheckCheck, Clock } from "lucide-react";

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
 */
export default function MessageBubble({ message, isMine }) {
  const pending = message.pending;
  const delivered = Boolean(message.deliveredAt);
  const read = Boolean(message.readAt);

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          relative
          max-w-[78%]
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
  );
}
