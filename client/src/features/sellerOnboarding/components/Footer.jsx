import { Sprout } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-[#dfe9d9] bg-[#f7faF2]">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#e5f1de] text-[#2f7d32]">
            <Sprout size={25} />
          </span>
          <span>
            <span className="block text-lg font-black text-[#173f1b]">Zarkhaiz Pakistan</span>
            <span className="block text-xs text-slate-500">Grow together. Sell smarter.</span>
          </span>
        </Link>

        <p className="text-sm text-slate-500">© {new Date().getFullYear()} Zarkhaiz Pakistan. All rights reserved.</p>
      </div>
    </footer>
  );
}
