import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  BadgePercent,
  Calendar,
  Copy,
  Gauge,
  Percent,
  Plus,
  ShoppingCart,
  Tag,
  Trash2,
} from "lucide-react";

import StatCard from "../../../../shared/components/Statcard";
import Badge from "../../../../shared/components/Badge";
import Button from "../../../../shared/components/ui/button";
import Card from "../../../../shared/components/ui/Card";
import Modal from "../../../../shared/components/ui/Modal";
import { formatMoney } from "../../../order/utils/orderDisplay";

const initialCoupons = [
  {
    id: "1",
    code: "WELCOME10",
    type: "percent",
    value: 10,
    minOrder: 1000,
    used: 214,
    limit: 500,
    expires: "Aug 31, 2026",
    status: "Active",
  },
  {
    id: "2",
    code: "EIDSAVE50",
    type: "flat",
    value: 500,
    minOrder: 5000,
    used: 86,
    limit: 200,
    expires: "Sep 15, 2026",
    status: "Active",
  },
  {
    id: "3",
    code: "FRESH20",
    type: "percent",
    value: 20,
    minOrder: 2000,
    used: 143,
    limit: 300,
    expires: "Jul 10, 2026",
    status: "Expired",
  },
  {
    id: "4",
    code: "FREESHIP",
    type: "shipping",
    value: 0,
    minOrder: 3000,
    used: 0,
    limit: 100,
    expires: "Sep 30, 2026",
    status: "Active",
  },
  {
    id: "5",
    code: "SPRING15",
    type: "percent",
    value: 15,
    minOrder: 1500,
    used: 57,
    limit: 250,
    expires: "Aug 05, 2026",
    status: "Expired",
  },
  {
    id: "6",
    code: "FARMFRESH",
    type: "flat",
    value: 300,
    minOrder: 2500,
    used: 12,
    limit: 150,
    expires: "Oct 01, 2026",
    status: "Scheduled",
  },
];

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Scheduled", value: "Scheduled" },
  { label: "Expired", value: "Expired" },
];

const STATUS_TONE = {
  Active: "green",
  Scheduled: "blue",
  Expired: "gray",
  Disabled: "red",
};

const typeLabel = (type) =>
  ({ percent: "Percentage", flat: "Flat Amount", shipping: "Free Shipping" }[
    type
  ] || type);

const discountLabel = (coupon) => {
  if (coupon.type === "percent") return `${coupon.value}% OFF`;
  if (coupon.type === "flat") return `${formatMoney(coupon.value)} OFF`;
  return "Free Shipping";
};

const CouponsPage = () => {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [form, setForm] = useState({
    code: "",
    type: "percent",
    value: "",
    minOrder: "",
    limit: "",
    expires: "",
  });

  const filtered = useMemo(() => {
    if (filter === "all") return coupons;
    return coupons.filter((c) => c.status === filter);
  }, [coupons, filter]);

  const activeCount = coupons.filter((c) => c.status === "Active").length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + c.used, 0);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    toast.success(`Coupon code ${code} copied.`);
  };

  const handleCreate = () => {
    if (!form.code.trim()) {
      toast.error("Please enter a coupon code.");
      return;
    }

    if (!form.value || Number(form.value) <= 0) {
      toast.error("Please enter a discount value.");
      return;
    }

    const newCoupon = {
      id: `c-${Date.now()}`,
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value),
      minOrder: Number(form.minOrder) || 0,
      used: 0,
      limit: Number(form.limit) || 100,
      expires: form.expires || "Dec 31, 2026",
      status: "Active",
    };

    setCoupons((prev) => [newCoupon, ...prev]);
    setModalOpen(false);
    setForm({ code: "", type: "percent", value: "", minOrder: "", limit: "", expires: "" });
    toast.success("Coupon created successfully.");
  };

  const handleDelete = (id) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    setDeleteId("");
    toast.success("Coupon deleted.");
  };

  const updateForm = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-green-100 p-2">
            <Tag size={20} className="text-green-700" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Coupons &amp; Discounts
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Create promotions to attract more customers.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus size={16} />}
          onClick={() => setModalOpen(true)}
        >
          Create Coupon
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Coupons"
          value={activeCount}
          icon={BadgePercent}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          trend={25}
        />

        <StatCard
          label="Total Redemptions"
          value={totalRedemptions}
          icon={ShoppingCart}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          trend={18.2}
        />

        <StatCard
          label="Discount Given"
          value={formatMoney(86450)}
          icon={Percent}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
          trend={12.5}
        />

        <StatCard
          label="Avg. Discount Used"
          value="14.5%"
          icon={Gauge}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          trend={4.1}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === f.value
                ? "bg-green-700 text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-green-50 hover:text-green-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Coupons list */}
      {filtered.length === 0 ? (
        <Card className="py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
            <Tag size={26} className="text-green-600" />
          </div>

          <p className="mt-4 font-medium text-gray-700">
            No coupons here yet
          </p>

          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
            Create your first coupon to start boosting sales.
          </p>

          <div className="mt-5">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => setModalOpen(true)}
            >
              Create Coupon
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((coupon) => (
            <Card key={coupon.id} className="flex flex-col">
              <div className="flex items-start justify-between">
                <button
                  type="button"
                  onClick={() => handleCopy(coupon.code)}
                  className="group flex items-center gap-2 rounded-lg border-2 border-dashed border-green-300 bg-green-50 px-3 py-2 transition hover:border-green-500"
                  title="Copy code"
                >
                  <span className="font-mono text-sm font-bold tracking-wider text-green-800">
                    {coupon.code}
                  </span>

                  <Copy
                    size={14}
                    className="text-green-600 opacity-60 transition group-hover:opacity-100"
                  />
                </button>

                <Badge color={STATUS_TONE[coupon.status] || "gray"}>
                  {coupon.status}
                </Badge>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {discountLabel(coupon)}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {typeLabel(coupon.type)}
                    {coupon.minOrder > 0 && (
                      <span> · Min order {formatMoney(coupon.minOrder)}</span>
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setDeleteId(coupon.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                  aria-label={`Delete ${coupon.code}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="mt-4 border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Usage</span>
                  <span className="font-medium text-gray-700">
                    {coupon.used} / {coupon.limit}
                  </span>
                </div>

                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${
                      coupon.used / coupon.limit >= 0.9
                        ? "bg-red-500"
                        : "bg-green-600"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (coupon.used / coupon.limit) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
                <Calendar size={13} />
                Expires {coupon.expires}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Coupon Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Coupon"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Coupon Code
            </label>

            <input
              type="text"
              value={form.code}
              onChange={(e) => updateForm("code", e.target.value.toUpperCase())}
              placeholder="e.g. SUMMER20"
              className={`${inputClass} font-mono uppercase tracking-wider`}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Discount Type
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "percent", label: "Percentage" },
                { id: "flat", label: "Flat Amount" },
                { id: "shipping", label: "Free Shipping" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => updateForm("type", t.id)}
                  className={`rounded-lg border px-2 py-2 text-xs font-medium transition ${
                    form.type === t.id
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-gray-200 text-gray-500 hover:border-green-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {form.type !== "shipping" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {form.type === "percent"
                  ? "Discount Percentage (%)"
                  : "Discount Amount (PKR)"}
              </label>

              <input
                type="number"
                value={form.value}
                onChange={(e) => updateForm("value", e.target.value)}
                placeholder={
                  form.type === "percent" ? "e.g. 10" : "e.g. 500"
                }
                className={inputClass}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Min. Order (PKR)
              </label>

              <input
                type="number"
                value={form.minOrder}
                onChange={(e) => updateForm("minOrder", e.target.value)}
                placeholder="e.g. 1000"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Usage Limit
              </label>

              <input
                type="number"
                value={form.limit}
                onChange={(e) => updateForm("limit", e.target.value)}
                placeholder="e.g. 100"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Expiry Date
            </label>

            <input
              type="date"
              value={form.expires}
              onChange={(e) => updateForm("expires", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              size="md"
              fullWidth
              leftIcon={<Plus size={16} />}
              onClick={handleCreate}
            >
              Create Coupon
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId("")}
        title="Delete Coupon?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This coupon will be removed immediately and can no longer be
            redeemed by customers.
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => setDeleteId("")}
            >
              Cancel
            </Button>

            <Button
              variant="danger"
              size="md"
              fullWidth
              leftIcon={<Trash2 size={16} />}
              onClick={() => handleDelete(deleteId)}
            >
              Delete Coupon
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CouponsPage;
