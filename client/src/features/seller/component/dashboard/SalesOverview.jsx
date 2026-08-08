import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import AreaLineChart from "../../../../shared/components/AreaLineChart";
import { getAnalytics } from "../../api/financeApi";

const toChartData = (series) =>
  (series || []).map((item) => ({
    name: item.label,
    value: item.revenue,
  }));

const SalesOverview = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("12m");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);

      try {
        const res = await getAnalytics();

        if (mounted) setData(toChartData(res?.data?.monthly));
      } catch (err) {
        console.error("Failed to load sales overview:", err);
        if (mounted) setData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const visible = range === "6m" ? data.slice(-6) : data;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">
          Sales Overview
        </h3>

        <select
          value={range}
          onChange={(event) => setRange(event.target.value)}
          className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-500 outline-none"
        >
          <option value="12m">Last 12 months</option>
          <option value="6m">Last 6 months</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center" style={{ height: 200 }}>
          <Loader2 size={24} className="animate-spin text-green-700" />
        </div>
      ) : visible.length === 0 ? (
        <div
          className="flex items-center justify-center text-sm text-gray-400"
          style={{ height: 200 }}
        >
          No sales data yet.
        </div>
      ) : (
        <AreaLineChart
          data={visible}
          height={200}
        />
      )}
    </div>
  );
};

export default SalesOverview;
