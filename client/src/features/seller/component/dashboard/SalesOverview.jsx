
import AreaLineChart from "../../../../shared/components/AreaLineChart";

const salesOverview = [
  { name: "May 17", value: 12 },
  { name: "May 24", value: 22 },
  { name: "May 31", value: 15 },
  { name: "Jun 7", value: 24 },
  { name: "Jun 14", value: 40 },
];

const SalesOverview = () => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">
          Sales Overview
        </h3>

        <select className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-500 outline-none">
          <option>This Month</option>
          <option>Last Month</option>
        </select>
      </div>

      <AreaLineChart
        data={salesOverview}
        height={200}
      />
    </div>
  );
};

export default SalesOverview;
