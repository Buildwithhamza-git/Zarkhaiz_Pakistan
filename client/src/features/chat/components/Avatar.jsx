const AVATAR_COLORS = [
  "bg-green-600",
  "bg-emerald-600",
  "bg-teal-600",
  "bg-lime-600",
  "bg-cyan-700",
  "bg-blue-600",
  "bg-indigo-600",
  "bg-violet-600",
  "bg-rose-500",
  "bg-amber-600",
];

const sizeClasses = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

function initialsOf(name = "") {
  return String(name)
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Avatar({ name = "", src, size = "md" }) {
  const hash = String(name).split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  const color = AVATAR_COLORS[hash % AVATAR_COLORS.length];

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      className={`${sizeClasses[size]} ${color} grid shrink-0 place-items-center rounded-full font-semibold text-white`}
    >
      {initialsOf(name) || "?"}
    </span>
  );
}
