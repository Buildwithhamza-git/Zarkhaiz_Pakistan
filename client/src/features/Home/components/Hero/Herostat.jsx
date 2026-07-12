import {
    Package,
    Users,
    Store,
    MapPin,
} from "lucide-react";

const stats = [
    {
        icon: Package,
        number: "20,000+",
        title: "Products",
    },
    {
        icon: Users,
        number: "500+",
        title: "Farmers",
    },
    {
        icon: Store,
        number: "150+",
        title: "Sellers",
    },
    {
        icon: MapPin,
        number: "50+",
        title: "Cities",
    },
];

export default function HeroStats() {
    return (
        <div
            className="
                absolute
                left-1/2
                bottom-0
                z-30
                w-full
                max-w-7xl
                -translate-x-1/2
                translate-y-1/2
                px-6
            "
        >
            <div
                className="
                    grid
                    grid-cols-2
                    md:grid-cols-4
                    gap-5

                    rounded-3xl
                    bg-white

                    shadow-2xl

                    p-8
                "
            >
                {stats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="
                                flex
                                items-center
                                justify-center
                                gap-4
                            "
                        >
                            <div
                                className="
                                    h-14
                                    w-14
                                    rounded-full
                                    bg-green-100
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <Icon
                                    size={28}
                                    className="text-green-700"
                                />
                            </div>

                            <div>

                                <h2 className="text-3xl font-bold text-green-800">
                                    {item.number}
                                </h2>

                                <p className="text-gray-500">
                                    {item.title}
                                </p>

                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}