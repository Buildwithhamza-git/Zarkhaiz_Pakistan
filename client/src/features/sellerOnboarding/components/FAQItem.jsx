import { ChevronDown } from "lucide-react";

export default function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#dfe9d9] bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-extrabold text-[#173f1b]">{question}</span>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#edf5e8] text-[#2f7d32] transition ${isOpen ? "rotate-180" : ""}`}>
          <ChevronDown size={19} />
        </span>
      </button>
      <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-sm leading-7 text-slate-500">{answer}</p>
        </div>
      </div>
    </div>
  );
}
