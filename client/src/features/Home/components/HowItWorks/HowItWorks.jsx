import { Fragment } from "react";
import {
    UserPlus,
    Search,
    ShoppingCart,
    CheckCircle,
    Truck,
    Star,
} from "lucide-react";

const STEPS = [
    { icon: UserPlus, title: "Register", description: "Create your account" },
    { icon: Search, title: "Browse Products", description: "Choose your products" },
    { icon: ShoppingCart, title: "Place Order", description: "Add to cart and order" },
    { icon: CheckCircle, title: "Seller Accepts", description: "Seller confirms your order" },
    { icon: Truck, title: "Delivery", description: "We deliver to you" },
    { icon: Star, title: "Review", description: "Rate and review" },
];

export default function HowItWorks() {
    return (
        <section className="px-4 sm:px-6 lg:px-10 py-10">
            <h2 className="text-center text-xl sm:text-2xl font-bold text-gray-900 mb-10">
                How It Works
            </h2>

            <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-0 max-w-6xl mx-auto">
                {STEPS.map((step, index) => {
                    const Icon = step.icon;
                    const isLast = index === STEPS.length - 1;

                    return (
                        <Fragment key={step.title}>
                            <div className="flex lg:flex-col items-center gap-4 lg:gap-0 lg:w-32 flex-shrink-0">
                                <div className="h-14 w-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-0 lg:mb-3 flex-shrink-0">
                                    <Icon size={22} className="text-green-700" />
                                </div>

                                <div className="text-left lg:text-center">
                                    <h3 className="font-semibold text-gray-900 text-sm">
                                        {index + 1}. {step.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {step.description}
                                    </p>
                                </div>
                            </div>

                            {!isLast && (
                                <div className="hidden lg:flex items-center justify-center flex-1 pt-7">
                                    <div className="w-full border-t-2 border-dashed border-gray-300" />
                                </div>
                            )}
                        </Fragment>
                    );
                })}
            </div>
        </section>
    );
}