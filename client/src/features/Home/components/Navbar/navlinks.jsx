import { NavLink } from "react-router-dom";

const links = [
    { name: "Home",path: "/",},
    {name: "Categories",path: "/categories",},
    {name: "Become Seller",path: "/become-seller",},
    {name: "About", path: "/about",},
];

export default function NavLinks() {
    return (
        <div className="hidden lg:flex items-center gap-8">

            {links.map((link) => (
                <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) => `font-medium transition 
                    ${isActive ? "text-green-700": "text-gray-700 hover:text-green-700"}`
                    }
                >
                    {link.name}
                </NavLink>
            ))}

        </div>
    );
}