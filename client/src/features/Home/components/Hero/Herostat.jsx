import { useEffect, useRef, useState } from "react";
import {
    Package,
    Users,
    Store,
    MapPin,
} from "lucide-react";

const stats = [
    {
        icon: Package,
        value: 20000,
        suffix: "+",
        title: "Products",
        description: "Agricultural products",
    },
    {
        icon: Users,
        value: 500,
        suffix: "+",
        title: "Farmers",
        description: "Growing with us",
    },
    {
        icon: Store,
        value: 150,
        suffix: "+",
        title: "Sellers",
        description: "Trusted suppliers",
    },
    {
        icon: MapPin,
        value: 50,
        suffix: "+",
        title: "Cities",
        description: "Across Pakistan",
    },
];

function AnimatedNumber({
    target,
    suffix = "",
    duration = 1600,
    startAnimation,
}) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!startAnimation) return;

        let startTime = null;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) {
                startTime = timestamp;
            }

            const progress = Math.min(
                (timestamp - startTime) / duration,
                1
            );

            const eased =
                1 - Math.pow(1 - progress, 4);

            setCount(
                Math.floor(eased * target)
            );

            if (progress < 1) {
                animationFrame =
                    requestAnimationFrame(animate);
            } else {
                setCount(target);
            }
        };

        animationFrame =
            requestAnimationFrame(animate);

        return () =>
            cancelAnimationFrame(animationFrame);

    }, [target, duration, startAnimation]);

    return (
        <>
            {count.toLocaleString()}
            {suffix}
        </>
    );
}

export default function HeroStats() {
    const sectionRef = useRef(null);

    const [visible, setVisible] =
        useState(false);

    useEffect(() => {
        const observer =
            new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        observer.disconnect();
                    }
                },
                {
                    threshold: 0.2,
                }
            );

        if (sectionRef.current) {
            observer.observe(
                sectionRef.current
            );
        }

        return () =>
            observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="
                relative
                z-20
                px-4
                sm:px-6
                lg:px-8
            "
        >
            <div
                className="
                    mx-auto
                    max-w-6xl
                    -mt-8
                    sm:-mt-10
                    lg:-mt-12
                "
            >

                {/* Compact Stats Card */}

                <div
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-green-100
                        bg-white/95
                        shadow-[0_12px_35px_rgba(22,101,52,0.12)]
                        backdrop-blur-md
                    "
                >

                    <div
                        className="
                            grid
                            grid-cols-2
                            lg:grid-cols-4
                        "
                    >

                        {stats.map((stat, index) => {
                            const Icon = stat.icon;

                            return (
                                <div
                                    key={stat.title}
                                    className={`
                                        group
                                        relative
                                        flex
                                        items-center
                                        gap-3
                                        px-4
                                        py-4
                                        transition
                                        duration-300
                                        hover:bg-green-50/70

                                        sm:px-6
                                        sm:py-5

                                        ${
                                            index === 1
                                                ? "border-l border-gray-100"
                                                : ""
                                        }

                                        ${
                                            index === 2
                                                ? "border-t border-gray-100 lg:border-l lg:border-t-0"
                                                : ""
                                        }

                                        ${
                                            index === 3
                                                ? "border-l border-t border-gray-100 lg:border-t-0"
                                                : ""
                                        }
                                    `}
                                >

                                    {/* Top hover indicator */}

                                    <div
                                        className="
                                            absolute
                                            left-0
                                            right-0
                                            top-0
                                            h-0.5
                                            origin-left
                                            scale-x-0
                                            bg-green-600
                                            transition-transform
                                            duration-300
                                            group-hover:scale-x-100
                                        "
                                    />

                                    {/* Icon */}

                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-green-50
                                            text-green-700
                                            transition
                                            duration-300
                                            group-hover:bg-green-700
                                            group-hover:text-white
                                            sm:h-11
                                            sm:w-11
                                        "
                                    >
                                        <Icon
                                            size={19}
                                            strokeWidth={1.8}
                                        />
                                    </div>

                                    {/* Content */}

                                    <div className="min-w-0">

                                        <div className="flex items-baseline gap-1">

                                            <h3
                                                className="
                                                    text-xl
                                                    font-extrabold
                                                    tracking-tight
                                                    text-gray-900
                                                    sm:text-2xl
                                                "
                                            >
                                                <AnimatedNumber
                                                    target={
                                                        stat.value
                                                    }
                                                    suffix={
                                                        stat.suffix
                                                    }
                                                    startAnimation={
                                                        visible
                                                    }
                                                />
                                            </h3>

                                        </div>

                                        <p
                                            className="
                                                text-xs
                                                font-bold
                                                text-green-700
                                                sm:text-sm
                                            "
                                        >
                                            {stat.title}
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                hidden
                                                text-[11px]
                                                text-gray-400
                                                sm:block
                                            "
                                        >
                                            {stat.description}
                                        </p>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                </div>

            </div>
        </section>
    );
}