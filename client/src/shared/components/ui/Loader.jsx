export default function Loader({
    text = "Loading...",
    fullscreen = false,
}) {
    const Wrapper = fullscreen ? "fixed inset-0 z-50" : "w-full";

    return (
        <div
            className={`${Wrapper} flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm`}
        >
            <div className="w-12 h-12 rounded-full border-4 border-green-200 border-t-green-700 animate-spin"></div>

            <p className="mt-4 text-green-700 font-medium">
                {text}
            </p>
        </div>
    );
}