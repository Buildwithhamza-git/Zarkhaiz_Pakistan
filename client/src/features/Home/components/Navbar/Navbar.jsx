import Logo from "./logo";
import NavLinks from "./navlinks";
import CartButton from "./cartButton";
import NotificationButton from "./NotificationButton";
import UserMenu from "./UserMenu";
import { useAuthContext } from "../../../../context/AuthContext";


export default function Navbar() {

    const { user } = useAuthContext();

    return (

        <header className="sticky top-0 z-50 bg-white shadow-sm">

            <div className="max-w-7xl mx-auto px-6">

                <div className="flex items-center justify-between h-20">

                    <div className="flex items-center gap-50">

                        <Logo />

                        <NavLinks />

                    </div>

                    <div className="flex items-center gap-5">

                        {user && <CartButton />}

                        {user && <NotificationButton />}

                        <UserMenu />

                    </div>

                </div>

            </div>

        </header>

    );
}