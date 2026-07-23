import { Sparkles } from "lucide-react";

const VARIANTS = {
    featured: "bg-green-700 text-white",
    discount: "bg-red-600 text-white",
};

export default function ProductBadge({ type, value }) {
    if (!type) return null;

    if (type === "featured") {
        return (
            <span
                className={`
                    inline-flex items-center gap-1
                    rounded-md px-2.5 py-1
                    text-xs font-semibold tracking-wide
                    shadow-sm
                    ${VARIANTS.featured}
                `}
            >
                <Sparkles size={12} className="shrink-0" />
                Featured
            </span>
        );
    }

    if (type === "discount") {
        return (
            <span
                className={`
                    inline-flex items-center
                    rounded-md px-2.5 py-1
                    text-xs font-bold
                    shadow-sm
                    ${VARIANTS.discount}
                `}
            >
                -{value}%
            </span>
        );
    }

    return null;
}