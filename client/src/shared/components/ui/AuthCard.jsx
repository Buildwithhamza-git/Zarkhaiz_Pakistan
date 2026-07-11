export default function AuthCard({
    title,
    subtitle,
    children,
    className = "",
}) {
    return (
        <div
            className={`
                w-3xl
                rounded-4xl
                border
                border-green-100
                bg-white/95
                backdrop-blur-sm
                shadow-2xl
                px-8
                py-10
                md:px-10
                transition-all
                duration-300
                hover:shadow-green-100
                ${className}
            `}
        >
            {(title || subtitle) && (
                <div className="mb-10 text-center">

                    {title && (
                        <h1 className="text-4xl font-extrabold tracking-tight text-green-800">
                            {title}
                        </h1>
                    )}

                    {subtitle && (
                        <p className="mt-3 text-base text-gray-600">
                            {subtitle}
                        </p>
                    )}

                </div>
            )}

            {children}
        </div>
    );
}