import StatCard from "./StatCard";

const stats = [
  { value: "10,000+", label: "Farmers" },
  { value: "5,000+", label: "Sellers" },
  { value: "50,000+", label: "Products" },
  { value: "100+", label: "Cities" },
];

export default function Statistics() {
  return (
    <section className="bg-[#184d20] py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
