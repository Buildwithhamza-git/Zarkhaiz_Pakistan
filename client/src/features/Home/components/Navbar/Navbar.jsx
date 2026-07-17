import { useAuthContext } from "../../../../context/authContext";
import CartButton from "./cartButton";
import Logo from "./logo";
import NavLinks from "./navlinks";
import NotificationButton from "./NotificationButton";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const { user } = useAuthContext();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-10 xl:gap-20">
            <Logo />
            <NavLinks />
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            {user && <CartButton />}
            {user && <NotificationButton />}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
