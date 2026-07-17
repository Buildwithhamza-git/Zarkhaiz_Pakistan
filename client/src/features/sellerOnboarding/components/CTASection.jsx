import { ArrowRight, CheckCircle2, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="bg-white px-6 pb-20 sm:pb-24 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[30px] bg-gradient-to-r from-[#174d20] via-[#21642a] to-[#2f7d32] px-7 py-10 shadow-[0_24px_60px_rgba(23,77,32,0.22)] sm:px-10 lg:px-14">
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[42px] border-white/5" />
        <div className="absolute bottom-0 left-[42%] h-32 w-32 rounded-full bg-[#f4cd3e]/10 blur-2xl" />

        <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="flex items-start gap-5">
            <div className="hidden h-20 w-20 shrink-0 place-items-center rounded-2xl bg-white/10 text-[#f7d84b] sm:grid">
              <Store size={40} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white sm:text-4xl">Ready to Grow Your Business?</h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-white/75">
                Join ambitious agricultural sellers who are building trusted stores and reaching more customers through Zarkhaiz Pakistan.
              </p>
            </div>
          </div>

          <div className="w-full shrink-0 lg:w-auto">
            <button
              type="button"
              onClick={() => navigate("/seller-registration")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#f4cd3e] px-8 py-4 font-black text-[#173f1b] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#ffda49] lg:w-auto"
            >
              Register Now
              <ArrowRight size={19} />
            </button>
            <p className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-white/75">
              <CheckCircle2 size={15} />
              Creating your seller application is free.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
