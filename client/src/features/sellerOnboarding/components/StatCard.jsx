export default function StatCard({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-7 text-center backdrop-blur-sm">
      <p className="text-3xl font-black text-[#f7d84b] sm:text-4xl">{value}</p>
      <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-white/80">{label}</p>
    </div>
  );
}
