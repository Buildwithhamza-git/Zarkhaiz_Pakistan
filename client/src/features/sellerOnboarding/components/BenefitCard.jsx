export default function BenefitCard({ icon: Icon, title, description }) {
  return (
    <article className="group rounded-2xl border border-[#e2eadc] bg-white p-7 text-center shadow-[0_10px_35px_rgba(23,63,27,0.05)] transition duration-300 hover:-translate-y-2 hover:border-[#b8d2ad] hover:shadow-[0_22px_50px_rgba(23,63,27,0.11)]">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#e8f2e2] text-[#2f7d32] transition group-hover:rotate-3 group-hover:bg-[#dcedd4]">
        <Icon size={30} strokeWidth={2.2} />
      </div>
      <h3 className="mt-5 text-lg font-black text-[#173f1b]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-500">{description}</p>
    </article>
  );
}
