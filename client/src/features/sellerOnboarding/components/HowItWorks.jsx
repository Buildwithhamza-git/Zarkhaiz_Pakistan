import { BadgeCheck, PackagePlus, ShoppingBag, UserRoundPlus } from "lucide-react";
import StepCard from "./StepCard";

const steps = [
  {
    icon: UserRoundPlus,
    title: "Register",
    description: "Create your seller application and tell us the basic details about your store.",
  },
  {
    icon: BadgeCheck,
    title: "Complete Verification",
    description: "Submit your business, identity, bank, and supporting documents for review.",
  },
  {
    icon: PackagePlus,
    title: "Upload Products",
    description: "Add clear product information, prices, stock, and quality images to your store.",
  },
  {
    icon: ShoppingBag,
    title: "Start Selling",
    description: "Receive orders, manage your sales, and grow your agricultural business online.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#f7faF2] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#4b8b43]">Simple seller journey</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#173f1b] sm:text-4xl">Start Selling in Four Easy Steps</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500">
            We keep the onboarding process clear so you can focus on your products and customers.
          </p>
        </div>

        <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => (
            <StepCard
              key={step.title}
              {...step}
              number={index + 1}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
