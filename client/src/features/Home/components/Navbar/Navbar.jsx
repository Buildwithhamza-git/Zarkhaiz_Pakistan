import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuthContext } from "../../../../context/authContext";
import CartButton from "./cartButton";
import WishlistNavButton from "./wishlistButton";
import Logo from "./logo";
import NavLinks from "./navlinks";
import NotificationButton from "./NotificationButton";
import UserMenu from "./UserMenu";

export default function Navbar() {
    const { user } = useAuthContext();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const mobileMenuRef = useRef(false);

    useEffect(() => {
        mobileMenuRef.current = mobileMenuOpen;
    }, [mobileMenuOpen]);

    // ==========================================
    // Show on scroll down, hide on scroll up
    // ==========================================

    useEffect(() => {
        let lastY = window.scrollY;
        let ticking = false;

        const handleScroll = () => {
            if (ticking) return;

            ticking = true;

            window.requestAnimationFrame(() => {
                const currentY = window.scrollY;

                setScrolled(currentY > 8);

                if (!mobileMenuRef.current) {
                    setHidden(
                        currentY > 160 &&
                            currentY < lastY
                    );
                }

                lastY = currentY;
                ticking = false;
            });
        };

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        handleScroll();

        return () =>
            window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`
                sticky
                top-0
                z-50
                transition-transform
                duration-500
                ease-in-out
                ${hidden ? "-translate-y-full" : "translate-y-0"}
            `}
        >
            <div
                className={`
                    border-b
                    bg-white/85
                    backdrop-blur-xl
                    transition-shadow
                    duration-300
                    ${
                        scrolled
                            ? "border-gray-200 shadow-md shadow-gray-900/5"
                            : "border-gray-100 shadow-sm"
                    }
                `}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="flex h-20 items-center justify-between">
                        <div className="flex items-center gap-8 xl:gap-12">
                            <Logo />
                            <NavLinks />
                        </div>

                        <div className="hidden shrink-0 items-center gap-3 lg:flex xl:gap-4">
                            {user && <CartButton />}
                            {user && <WishlistNavButton />}
                            {user && <NotificationButton />}
                            <UserMenu />
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setMobileMenuOpen((current) => !current)
                            }
                            className="grid h-11 w-11 place-items-center rounded-full text-gray-700 transition hover:bg-green-50 hover:text-green-700 lg:hidden"
                            aria-label={
                                mobileMenuOpen
                                    ? "Close navigation menu"
                                    : "Open navigation menu"
                            }
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-navigation"
                        >
                            {mobileMenuOpen ? (
                                <X size={24} />
                            ) : (
                                <Menu size={24} />
                            )}
                        </button>
                    </div>

                    {mobileMenuOpen && (
                        <div
                            id="mobile-navigation"
                            className="border-t border-gray-100 pb-5 lg:hidden"
                        >
                            <NavLinks
                                mobile
                                onNavigate={() =>
                                    setMobileMenuOpen(false)
                                }
                            />

                            <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 px-4 pt-4">
                                {user && <CartButton />}
                                {user && <WishlistNavButton />}
                                {user && <NotificationButton />}
                                <UserMenu />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}