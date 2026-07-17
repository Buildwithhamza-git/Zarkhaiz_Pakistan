import { Banknote, MapPinned, ShieldCheck, TrendingUp } from "lucide-react";
import BenefitCard from "./BenefitCard";

const benefits = [
  {
    icon: TrendingUp,
    title: "Higher Sales",
    description: "Reach customers beyond your local market and create more opportunities for every product you list.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Customers",
    description: "Trade with genuine buyers through a marketplace designed to build trust on both sides.",
  },
  {
    icon: Banknote,
    title: "Secure Payments",
    description: "Receive payments through a clear, protected process and keep better track of your earnings.",
  },
  {
    icon: MapPinned,
    title: "Nationwide Reach",
    description: "Showcase your products to farmers, retailers, and agricultural buyers across Pakistan.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#4b8b43]">Why sell with us?</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#173f1b] sm:text-4xl">
            Everything You Need to Succeed
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500">
            A simple seller experience built to help you sell confidently, grow faster, and stay in control.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <BenefitCard key={benefit.title} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  );
}
