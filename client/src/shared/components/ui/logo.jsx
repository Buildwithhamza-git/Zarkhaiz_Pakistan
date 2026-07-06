export default function Logo({ size = "md" }) {
    const sizes = {
        sm: {
            container: "w-10 h-10",
            icon: "text-xl",
            title: "text-4xl",
            subtitle: "text-xs",
        },
        md: {
            container: "w-20 h-20",
            icon: "text-3xl",
            title: "text-2xl",
            subtitle: "text-2xl",
        },
        lg: {
            container: "w-30 h-20",
            icon: "text-5xl",
            title: "text-4xl",
            subtitle: "text-base",
        },
    };

    const current = sizes[size];

    return (
        <div className="flex items-center gap-3">
            <div
                className={`${current.container} rounded-full bg-green-700 flex items-center justify-center shadow-lg`}
            >
                <span className={current.icon}>🌾</span>
            </div>

            <div>
                <h1 className={`${current.title} font-bold text-green-800`}>
                    Zarkhaiz
                </h1>

                <p className={`${current.subtitle} text-yellow-600 font-medium`}>
                    Pakistan
                </p>
            </div>
        </div>
    );
}