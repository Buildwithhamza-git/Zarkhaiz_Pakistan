export default function StepCard({ number, icon: Icon, title, description, isLast }) {
  return (
    <article className="relative text-center">
      {!isLast && (
        <div className="absolute left-[62%] top-10 hidden h-px w-[76%] border-t-2 border-dashed border-[#b8d2ad] lg:block" />
      )}
      <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-full border-8 border-[#edf5e8] bg-[#2f7d32] text-white shadow-lg">
        <Icon size={29} />
        <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-[#f4cd3e] text-xs font-black text-[#173f1b]">
          {number}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-black text-[#173f1b]">{title}</h3>
      <p className="mx-auto mt-3 max-w-[250px] text-sm leading-7 text-slate-500">{description}</p>
    </article>
  );
}
