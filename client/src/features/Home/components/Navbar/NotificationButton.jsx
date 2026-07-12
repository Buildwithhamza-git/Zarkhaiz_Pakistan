import { Bell } from "lucide-react";

export default function NotificationButton() {

    // Dummy notification count
    const notificationCount = 1;

    return (
        <button
            className="
                relative
                flex
                items-center
                justify-center
                w-11
                h-11
                rounded-full
                hover:bg-green-50
                transition
            "
        >
            <Bell
                size={22}
                className="text-gray-700"
            />

            {notificationCount > 0 && (
                <span
                    className="
                        absolute
                        -top-1
                        -right-1
                        w-5
                        h-5
                        rounded-full
                        bg-red-500
                        text-white
                        text-[11px]
                        font-semibold
                        flex
                        items-center
                        justify-center
                    "
                >
                    {notificationCount}
                </span>
            )}
        </button>
    );
}