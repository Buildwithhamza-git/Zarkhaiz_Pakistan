import { Link } from "react-router-dom";
import { Sprout, Leaf } from "lucide-react";

const QUICK_LINKS = [
    { label: "Home", to: "/" },
    { label: "Categories", to: "/products" },
    { label: "Become Seller", to: "/become-seller" },
    { label: "About Us", to: "/about" },
    { label: "Contact Us", to: "/contact" },
];

// NOTE: only the categories shown in the footer design are listed here
// (kept separate from the full 8-item CATEGORIES list used in Shop by Categories)
const FOOTER_CATEGORIES = [
    { label: "Crops", to: "/products" },
    { label: "Vegetables", to: "/products" },
    { label: "Fruits", to: "/products" },
    { label: "Seeds", to: "/products" },
    { label: "Fertilizers", to: "/products" },
];

const SOCIAL_ICON_PATHS = {
    facebook:
        "M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.3-1.5 1.6-1.5H16.5V4.3C16.2 4.3 15.2 4 14 4c-2.4 0-4 1.5-4 4.1v2.4H7.5v3H10V21h3.5z",
    youtube:
        "M21.6 7.2c-.2-1-.9-1.7-1.9-1.9C17.9 5 12 5 12 5s-5.9 0-7.7.3c-1 .2-1.7.9-1.9 1.9C2 9 2 12 2 12s0 3 .4 4.8c.2 1 .9 1.7 1.9 1.9C6.1 19 12 19 12 19s5.9 0 7.7-.3c1-.2 1.7-.9 1.9-1.9.4-1.8.4-4.8.4-4.8s0-3-.4-4.8ZM10 15V9l5 3-5 3Z",
    twitter:
        "M20 5.9c-.6.3-1.3.5-2 .6.7-.4 1.3-1.2 1.6-2-.7.4-1.5.7-2.3.9A3.6 3.6 0 0 0 12 8.6c0 .3 0 .5.1.8-3-.2-5.6-1.6-7.4-3.9-.3.5-.5 1.2-.5 1.8 0 1.2.6 2.3 1.6 3-.6 0-1.1-.2-1.6-.4v.1c0 1.7 1.2 3.2 2.9 3.5-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.4 1.7 2.4 3.2 2.4A7.2 7.2 0 0 1 3 17.8a10.1 10.1 0 0 0 5.5 1.6c6.6 0 10.2-5.5 10.2-10.2v-.5c.7-.5 1.3-1.1 1.8-1.8z",
};

const SOCIAL_LINKS = [
    { name: "Facebook", href: "https://facebook.com", type: "facebook" },
    { name: "Instagram", href: "https://instagram.com", type: "instagram" },
    { name: "YouTube", href: "https://youtube.com", type: "youtube" },
    { name: "Twitter", href: "https://twitter.com", type: "twitter" },
];

function SocialIcon({ type }) {
    if (type === "instagram") {
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
        );
    }

    const path = SOCIAL_ICON_PATHS[type];

    if (!path) {
        return null;
    }

    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d={path} />
        </svg>
    );
}

export default function Footer() {
    return (
        <footer className="bg-[#0F2818] text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="md:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-3">
                            <div className="h-14 w-14 rounded-full bg-green-100/90 flex items-center justify-center flex-shrink-0">
                                <Sprout size={26} className="text-green-800" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Zarkhaiz</h3>
                                <p className="text-sm font-semibold text-lime-400">Pakistan</p>
                                <p className="text-xs text-gray-300">Grow Together</p>
                            </div>
                        </div>

                        <div className="w-10 border-t-2 border-lime-500 my-4" />

                        <p className="text-sm text-gray-300 leading-relaxed max-w-xs">
                            Zarkhaiz Pakistan is an AI powered agriculture marketplace
                            connecting farmers, buyers and sellers across the country.
                        </p>
                    </div>

                    <div className="md:pl-6 lg:pl-10">
                        <h4 className="text-lg font-bold mb-2">Quick Links</h4>
                        <div className="w-8 border-t-2 border-lime-500 mb-4" />

                        <ul className="space-y-3">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="flex items-center gap-2 text-sm text-gray-200 hover:text-lime-400 transition-colors duration-200"
                                    >
                                        <Leaf size={14} className="text-lime-500" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:pl-6 lg:pl-10 md:border-l md:border-white/10">
                        <h4 className="text-lg font-bold mb-2">Categories</h4>
                        <div className="w-8 border-t-2 border-lime-500 mb-4" />

                        <ul className="space-y-3">
                            {FOOTER_CATEGORIES.map((category) => (
                                <li key={category.label}>
                                    <Link
                                        to={category.to}
                                        className="flex items-center gap-2 text-sm text-gray-200 hover:text-lime-400 transition-colors duration-200"
                                    >
                                        <Leaf size={14} className="text-lime-500" />
                                        {category.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex md:justify-end items-start gap-3">
                        {SOCIAL_LINKS.map((social) => (
                         <a   
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.name}
                                className="h-11 w-11 rounded-full border border-lime-500/60 flex items-center justify-center text-white hover:bg-lime-500 hover:text-[#0F2818] transition-colors duration-200"
                            >
                                <SocialIcon type={social.type} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10">
                <p className="flex items-center justify-center gap-2 text-sm text-gray-300 py-5">
                    <Sprout size={14} className="text-lime-500" />
                    <span>Zarkhaiz Pakistan. All rights reserved.</span>
                </p>
            </div>
        </footer>
    );
}