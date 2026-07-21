import { ArrowRight, BadgeCheck, BarChart3, Headphones, Play, ShieldCheck, Store, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import farmerImage from "../assets/img.png";

const highlights = [
  { icon: Users, title: "Reach more buyers", text: "Sell across Pakistan" },
  { icon: BarChart3, title: "Grow your sales", text: "Use simple insights" },
  { icon: ShieldCheck, title: "Secure payments", text: "Protected transactions" },
  { icon: Headphones, title: "Seller support", text: "Help when you need it" },
];

export default function HeroSection() {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-[#f7faF2]">
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#dfeccf]/60 blur-3xl" />
      <div className="absolute right-[40%] top-0 h-64 w-64 rounded-full bg-[#f6d75c]/20 blur-3xl" />

      <div className="relative mx-auto grid min-h-[690px] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-20">
        <div className="z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d5e4c8] bg-white/80 px-4 py-2 text-sm font-semibold text-[#2f6b2f] shadow-sm backdrop-blur">
            <Store size={17} />
            Become a trusted Zarkhaiz seller
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-[1.1] tracking-tight text-[#173f1b] sm:text-5xl lg:text-[64px]">
            Grow Your Business With
            <span className="block text-[#2f7d32]">Zarkhaiz Pakistan</span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Put your agricultural products in front of serious buyers, build a trusted online store, and turn every harvest into a stronger business opportunity.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/seller-registration")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2f7d32] px-7 py-4 text-base font-bold text-white shadow-[0_14px_30px_rgba(47,125,50,0.24)] transition hover:-translate-y-0.5 hover:bg-[#256629]"
            >
              Register as Seller
              <ArrowRight size={19} />
            </button>

            {/* <button
              type="button"
              // onClick={scrollToHowItWorks}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#aac7a2] bg-white px-7 py-4 text-base font-bold text-[#275f2a] transition hover:border-[#2f7d32] hover:bg-[#f2f8ed]"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#e6f1df]">
                <Play size={14} fill="currentColor" />
              </span>
              See How It Works
            </button> */}
          </div>

          <div className="mt-11 grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-4">
            {highlights.map(({ icon: Icon, title, text }) => (
              <div key={title} className="group">
                <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-[#e5f1de] text-[#2f7d32] transition group-hover:-translate-y-1 group-hover:bg-[#d8ebce]">
                  <Icon size={22} />
                </div>
                <p className="text-sm font-extrabold text-[#234f26]">{title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[500px] lg:min-h-[610px]">
          <div className="absolute -right-20 -top-10 h-[650px] w-[650px] rounded-full border border-[#ebcf55]/60" />
          <div className="absolute inset-0 overflow-hidden rounded-[42px] bg-[#dcebcf] shadow-[0_30px_80px_rgba(27,72,31,0.18)] lg:rounded-l-[180px] lg:rounded-r-[38px]">
            <img
              src={farmerImage}
              alt="Pakistani farmer growing an agriculture business"
              className="h-full w-full object-cover object-[64%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#123918]/45 via-transparent to-transparent" />
          </div>

          <div className="absolute left-4 top-8 w-[220px] rounded-2xl border border-white/70 bg-white/95 p-4 shadow-2xl backdrop-blur sm:left-8 sm:top-12">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-500">Your business</p>
              <BadgeCheck size={18} className="text-[#2f7d32]" /> 
            </div>
            <p className="mt-4 text-xs text-slate-500">Monthly sales</p>
            <p className="mt-1 text-2xl font-black text-[#173f1b]">Rs. 125,750</p>
            <p className="mt-1 text-xs font-bold text-emerald-600">+24% this month</p>
            <div className="mt-5 flex h-14 items-end gap-2">
              {[34, 47, 39, 62, 55, 78, 88].map((height, index) => (
                <span
                  key={`${height}-${index}`}
                  className="flex-1 rounded-t bg-[#7fb77e]"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          <div className="absolute bottom-7 right-3 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-2xl sm:right-7">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[#f4cd3e] text-white">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Trusted by</p>
              <p className="text-xl font-black text-[#173f1b]">5,000+</p>
              <p className="text-xs text-slate-500">sellers nationwide</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
