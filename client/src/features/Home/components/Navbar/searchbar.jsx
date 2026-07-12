import { Search } from "lucide-react";

export default function SearchBar() {
    return (
        <div
            className="
                hidden
                lg:flex flex-1 max-w-md mx-8
                xl:flex
                items-center
                bg-white
                rounded-full
                border
                border-gray-200
                px-4
                py-2
                shadow-sm
            "
        >
            <input
                type="text"
                placeholder="Search crops, fertilizers..."
                className="
                    flex-1
                    outline-none
                    text-sm
                    bg-transparent
                "
            />

            <button
                className="
                    bg-green-700
                    p-2
                    rounded-full
                    text-white
                    hover:bg-green-800
                "
            >
                <Search size={18} />
            </button>
        </div>
    );
}