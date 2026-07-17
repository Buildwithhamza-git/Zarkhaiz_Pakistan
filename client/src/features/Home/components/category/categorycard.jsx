export default function CategoryCard({ name, image, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex flex-col items-center gap-3 group focus:outline-none"
        >
            <div
                className="
                    h-20 w-20
                    sm:h-24 sm:w-24
                    rounded-full
                    overflow-hidden
                    border-2
                    border-transparent
                    shadow-sm
                    transition-all
                    duration-200
                    group-hover:scale-105
                    group-hover:shadow-lg
                    group-hover:border-green-600
                "
            >
                <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
            </div>

            <span className="text-sm font-medium text-gray-700 group-hover:text-green-700 transition-colors duration-200">
                {name}
            </span>
        </button>
    );
}