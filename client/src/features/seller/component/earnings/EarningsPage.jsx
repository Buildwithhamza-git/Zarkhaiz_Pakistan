import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Banknote,
  CheckCircle2,
  IndianRupee,
  Landmark,
  Loader2,
  Package,
  Smartphone,
  Truck,
  Wallet,
} from "lucide-react";

import { useSellerContext } from "../../../../context/sellerContext";

import { getEarningsSummary } from "../../api/financeApi";
import { formatMoney } from "../../../order/utils/orderDisplay";

const SummaryCard = ({ icon: Icon, label, value, sub, accent }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-4">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}
      >
        <Icon size={20} />
      </span>

      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  </div>
);

const AccountRow = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-gray-100 py-3 last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-semibold text-gray-900">
      {value || "Not set"}
    </span>
  </div>
);

export default function EarningsPage() {
  const { seller, isApproved } = useSellerContext();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isApproved) return;

    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await getEarningsSummary();

        if (mounted) setData(res?.data || null);
      } catch (err) {
        if (mounted) setError(err?.message || "Failed to load earnings.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [isApproved]);

  if (!isApproved) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-500">
          You are not authorized to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your revenue, available balance, and payment details.
          </p>
        </div>

        <Link
          to="/seller/payouts"
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
        >
          <Wallet size={18} />
          Request Payout
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin text-green-700" />
        </div>
      ) : !data ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-sm">
          <p className="text-sm text-gray-500">No earnings data available.</p>
        </div>
      ) : (
        <>
          {/* Available balance highlight */}
          <div className="rounded-2xl bg-gradient-to-r from-green-700 to-green-600 p-6 text-white shadow-sm">
            <p className="text-sm font-medium text-green-100">
              Available Balance
            </p>
            <p className="mt-2 text-4xl font-bold">
              {formatMoney(data.available)}
            </p>
            <p className="mt-2 text-xs text-green-100">
              Ready to withdraw. Earned once orders are delivered.
            </p>
          </div>

          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              icon={IndianRupee}
              label="Earned Revenue"
              value={formatMoney(data.earned)}
              sub={`${data.earnedOrders} delivered orders`}
              accent="bg-green-100 text-green-700"
            />
            <SummaryCard
              icon={Truck}
              label="In Transit"
              value={formatMoney(data.inTransit)}
              sub="Processing + shipped"
              accent="bg-blue-100 text-blue-700"
            />
            <SummaryCard
              icon={CheckCircle2}
              label="Paid Out"
              value={formatMoney(data.paidOut)}
              accent="bg-purple-100 text-purple-700"
            />
            <SummaryCard
              icon={Package}
              label="Orders"
              value={data.totalOrders ?? "—"}
              sub={`${data.unitsSold ?? 0} units sold`}
              accent="bg-yellow-100 text-yellow-700"
            />
          </div>

          {/* Account details */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <Landmark size={18} className="text-gray-400" />
              <h3 className="font-semibold text-gray-800">
                Payment Details
              </h3>
            </div>

            <div className="mt-3">
              <AccountRow label="Store" value={seller?.storeName} />
              <AccountRow label="Bank Name" value={data.account?.bankName} />
              <AccountRow label="Account Title" value={data.account?.accountTitle} />
              <AccountRow label="IBAN" value={data.account?.iban} />

              <div className="flex items-center gap-2 pt-3">
                <Smartphone size={16} className="text-gray-400" />
                <h4 className="text-sm font-semibold text-gray-700">
                  Mobile Wallets
                </h4>
              </div>

              <AccountRow label="JazzCash" value={data.account?.jazzCash} />
              <AccountRow label="EasyPaisa" value={data.account?.easyPaisa} />
            </div>

            <p className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
              <Banknote size={14} />
              Payouts are transferred using the details above. Update them in
              Store Settings.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
