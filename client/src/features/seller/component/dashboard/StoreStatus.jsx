
import Badge from "../../../../shared/components/Badge";
import DonutChart from "../../../../shared/components/DonutChart";

const StoreStatus = ({ seller }) => {
  const completedFields = [
    seller?.storeName,
    seller?.description,
    seller?.province,
    seller?.city,
    seller?.address,
    seller?.businessType,
    seller?.bankName,
    seller?.accountTitle,
    seller?.iban,
    seller?.cnicFront,
    seller?.cnicBack,
  ];

  const completion = Math.round(
    (completedFields.filter(Boolean).length /
      completedFields.length) *
      100
  );

  const checklist = [
    {
      label: "Store Information",
      completed: !!seller?.storeName,
    },
    {
      label: "Business Details",
      completed: !!seller?.businessType,
    },
    {
      label: "Bank Information",
      completed: !!seller?.bankName,
    },
    {
      label: "CNIC Uploaded",
      completed: !!seller?.cnicFront && !!seller?.cnicBack,
    },
    {
      label: "Seller Verification",
      completed: seller?.status === "approved",
    },
  ];

  const badgeColor =
    seller?.status === "approved"
      ? "green"
      : seller?.status === "pending"
      ? "yellow"
      : "red";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">
          Store Status
        </h3>

        <Badge color={badgeColor}>
          {seller?.status || "Unknown"}
        </Badge>
      </div>

      <div className="flex items-center gap-5">
        <DonutChart
          data={[
            {
              value: completion,
              color: "#15803d",
            },
            {
              value: 100 - completion,
              color: "#e5e7eb",
            },
          ]}
          size={100}
          strokeWidth={11}
          centerTitle={`${completion}%`}
        />

        <div>
          <p className="font-semibold text-gray-700">
            {seller?.storeName}
          </p>

          <p className="text-sm text-gray-500">
            {seller?.city}, {seller?.province}
          </p>

          <p className="mt-2 text-xs text-gray-400">
            Profile Completion
          </p>
        </div>
      </div>

      <ul className="mt-5 space-y-3">
        {checklist.map((item) => (
          <li
            key={item.label}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-gray-600">
              {item.label}
            </span>

            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                item.completed
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {item.completed ? "âœ“" : "â€¢"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoreStatus;
