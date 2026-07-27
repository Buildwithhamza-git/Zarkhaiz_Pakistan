import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuthContext } from "../../../../context/authContext";
import CartButton from "./cartButton";
import Logo from "./logo";
import NavLinks from "./navlinks";
import NotificationButton from "./NotificationButton";
import UserMenu from "./UserMenu";

export default function Navbar() {
    const { user } = useAuthContext();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex h-20 items-center justify-between">
                    <div className="flex items-center gap-12 xl:gap-20">
                        <Logo />
                        <NavLinks />
                    </div>

                    <div className="hidden shrink-0 items-center gap-3 lg:flex xl:gap-5">
                        {user && <CartButton />}
                        {user && <NotificationButton />}
                        <UserMenu />
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((current) => !current)}
                        className="grid h-11 w-11 place-items-center rounded-full text-gray-700 transition hover:bg-green-50 hover:text-green-700 lg:hidden"
                        aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-navigation"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div id="mobile-navigation" className="border-t border-gray-100 pb-5 lg:hidden">
                        <NavLinks mobile onNavigate={() => setMobileMenuOpen(false)} />

                        <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 px-4 pt-4">
                            {user && <CartButton />}
                            {user && <NotificationButton />}
                            <UserMenu />
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
