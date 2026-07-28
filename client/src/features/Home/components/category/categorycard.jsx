import {
    ArrowUpRight,
    Sprout,
} from "lucide-react";

export default function CategoryCard({
    name,
    description,
    image,
    icon: Icon,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
                group
                relative
                w-full
                overflow-hidden
                rounded-3xl
                border
                border-gray-200
                bg-white
                text-left
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-green-200
                hover:shadow-xl
            "
        >
            <div className="relative aspect-[4/3] overflow-hidden">

                <img
                    src={image}
                    alt={name}
                    loading="lazy"
                    className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-110
                    "
                />

                <div className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/70
                    via-black/10
                    to-transparent
                " />

                <div className="
                    absolute
                    left-4
                    top-4
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/90
                    text-green-700
                    shadow-lg
                ">
                    {Icon ? (
                        <Icon size={20} />
                    ) : (
                        <Sprout size={20} />
                    )}
                </div>

                <div className="
                    absolute
                    right-4
                    top-4
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-white/90
                    text-gray-700
                    opacity-0
                    transition
                    group-hover:opacity-100
                ">
                    <ArrowUpRight size={17} />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5">

                    <h3 className="text-lg font-bold text-white">
                        {name}
                    </h3>

                    <p className="mt-1 text-xs text-white/80">
                        {description}
                    </p>

                </div>

            </div>
        </button>
    );
}