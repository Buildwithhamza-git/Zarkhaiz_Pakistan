import { Calendar, FileDown, Leaf } from "lucide-react";

import Button from "../../../../shared/components/ui/button";

const DashboardHeader = ({ seller }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-green-100 p-2">
          <Leaf size={20} className="text-green-700" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Welcome back,
            <span className="font-semibold text-green-700">
              {" "}
              {seller?.storeName || "Seller"}
            </span>
          </p>

          <p className="text-xs text-gray-400">
            Here's what's happening with your store today.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Calendar size={16} />}
        >
          This Month
        </Button>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<FileDown size={16} />}
        >
          Export Report
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
