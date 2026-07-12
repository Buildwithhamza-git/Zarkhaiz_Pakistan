import {
    Sprout,
    Leaf,
    Truck,
    Package,
} from "lucide-react";

const items = [
    {
        icon: Sprout,
        title: "Fresh Crops",
    },
    {
        icon: Leaf,
        title: "Certified Seeds",
    },
    {
        icon: Package,
        title: "Premium Fertilizers",
    },
    {
        icon: Truck,
        title: "Fast Delivery",
    },
];

export default function HeroFeatures() {
    return (
        <div className="mt-8 flex flex-wrap gap-4">

            {items.map((item) => {

                const Icon = item.icon;

                return (
                    <div
                        key={item.title}
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-full
                            bg-white/90
                            px-5
                            py-3
                            shadow-md
                        "
                    >
                        <Icon
                            size={20}
                            className="text-green-700"
                        />

                        <span className="font-medium">
                            {item.title}
                        </span>

                    </div>
                );
            })}

        </div>
    );
}