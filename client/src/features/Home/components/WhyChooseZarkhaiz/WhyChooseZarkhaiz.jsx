import { UserCheck, ShieldCheck, Lock, Truck, Sprout } from "lucide-react";

const FEATURES = [
    {
        icon: UserCheck,
        title: "Verified Farmers",
        description: "All our farmers are verified for quality and authenticity.",
    },
    {
        icon: ShieldCheck,
        title: "Verified Sellers",
        description: "Trusted agricultural sellers with quality assured products.",
    },
    {
        icon: Lock,
        title: "Secure Payments",
        description: "100% secure payment methods and cash on delivery.",
    },
    {
        icon: Truck,
        title: "Fast Delivery",
        description: "Fast and reliable delivery to your location.",
    },
];

export default function WhyChooseZarkhaiz() {
    return (
        <section className="px-4 sm:px-6 lg:px-10 py-10">
            <h2 className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-bold text-gray-900 mb-8">
                <Sprout size={20} className="text-green-600" />
                Why Choose Zarkhaiz?
                <Sprout size={20} className="text-green-600" />
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {FEATURES.map((feature) => {
                    const Icon = feature.icon;

                    return (
                        <div
                            key={feature.title}
                            className="
                                rounded-2xl
                                border border-gray-100
                                bg-white
                                shadow-sm
                                p-6
                                transition-all
                                duration-200
                                hover:shadow-lg
                                hover:-translate-y-1
                            "
                        >
                            <div className="h-12 w-12 rounded-xl bg-green-700 flex items-center justify-center mb-4">
                                <Icon size={22} className="text-white" />
                            </div>

                            <h3 className="font-semibold text-gray-900 text-base mb-1">
                                {feature.title}
                            </h3>

                            <p className="text-sm text-gray-500">
                                {feature.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}