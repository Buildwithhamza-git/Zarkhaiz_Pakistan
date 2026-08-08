import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Banknote,
  Loader2,
  Plus,
  Wallet,
} from "lucide-react";

import { useSellerContext } from "../../../../context/sellerContext";

import {
  cancelPayout,
  getEarningsSummary,
  getMyPayouts,
  requestPayout,
} from "../../api/financeApi";
import { formatMoney, formatDateTime } from "../../../order/utils/orderDisplay";
import Modal from "../../../../shared/components/ui/Modal";
import Button from "../../../../shared/components/ui/button";

const STATUS_META = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Approved", className: "bg-blue-100 text-blue-700" },
  paid: { label: "Paid", className: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-600" },
};

const METHOD_LABELS = {
  bank: "Bank Transfer",
  jazzcash: "JazzCash",
  easypaisa: "EasyPaisa",
};

const PAGE_SIZE = 10;

const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] || STATUS_META.pending;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${meta.className}`}
    >
      {meta.label}
    </span>
  );
};

export default function PayoutsPage() {
  const { isApproved } = useSellerContext();

  const [payouts, setPayouts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestOpen, setRequestOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState("");

  const [form, setForm] = useState({ amount: "", method: "bank" });

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const [listRes, summaryRes] = await Promise.all([
        getMyPayouts({ page, limit: PAGE_SIZE }),
        getEarningsSummary(),
      ]);

      setPayouts(listRes?.data?.items || []);
      setTotalPages(listRes?.data?.totalPages || 1);
      setSummary(summaryRes?.data || null);
    } catch (err) {
      setError(err?.message || "Failed to load payouts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isApproved) return;

    let mounted = true;

    const run = async () => {
      setLoading(true);
      setError("");

      try {
        const [listRes, summaryRes] = await Promise.all([
          getMyPayouts({ page, limit: PAGE_SIZE }),
          getEarningsSummary(),
        ]);

        if (!mounted) return;

        setPayouts(listRes?.data?.items || []);
        setTotalPages(listRes?.data?.totalPages || 1);
        setSummary(summaryRes?.data || null);
      } catch (err) {
        if (mounted) setError(err?.message || "Failed to load payouts.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [isApproved, page]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const amount = Number(form.amount);

    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }

    if (summary && amount > summary.available) {
      toast.error(
        `Amount exceeds available balance (${formatMoney(summary.available)}).`
      );
      return;
    }

    setSubmitting(true);

    try {
      await requestPayout({ amount, method: form.method });

      toast.success("Payout request submitted.");

      setForm({ amount: "", method: "bank" });
      setRequestOpen(false);

      load();
    } catch (err) {
      toast.error(err?.message || "Failed to request payout.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (payoutId) => {
    setCancellingId(payoutId);

    try {
      await cancelPayout(payoutId);

      toast.success("Payout request cancelled.");

      setPayouts((prev) =>
        prev.map((payout) =>
          payout._id === payoutId
            ? { ...payout, status: "cancelled" }
            : payout
        )
      );

      load();
    } catch (err) {
      toast.error(err?.message || "Failed to cancel payout.");
    } finally {
      setCancellingId("");
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
          <p className="mt-1 text-sm text-gray-500">
            Request withdrawals from your available earnings.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus size={18} />}
          onClick={() => setRequestOpen(true)}
          disabled={!summary || summary.available <= 0}
        >
          Request Payout
        </Button>
      </div>

      {/* Balance banner */}
      <div className="rounded-2xl bg-gradient-to-r from-green-700 to-green-600 p-6 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-green-100">
              Available Balance
            </p>
            <p className="mt-1 text-3xl font-bold">
              {formatMoney(summary?.available)}
            </p>
          </div>

          <div className="flex gap-8 text-sm">
            <div>
              <p className="text-green-100">Earned</p>
              <p className="mt-1 font-semibold">
                {formatMoney(summary?.earned)}
              </p>
            </div>
            <div>
              <p className="text-green-100">In Transit</p>
              <p className="mt-1 font-semibold">
                {formatMoney(summary?.inTransit)}
              </p>
            </div>
            <div>
              <p className="text-green-100">Paid Out</p>
              <p className="mt-1 font-semibold">
                {formatMoney(summary?.paidOut)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Payout history */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h3 className="font-semibold text-gray-800">Payout History</h3>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-green-700" />
          </div>
        ) : payouts.length === 0 ? (
          <div className="py-20 text-center">
            <Banknote size={32} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-500">No payouts yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-3.5 font-semibold">Amount</th>
                  <th className="px-5 py-3.5 font-semibold">Method</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold">Reference</th>
                  <th className="px-5 py-3.5 font-semibold">Requested</th>
                  <th className="px-5 py-3.5 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {payouts.map((payout) => (
                  <tr key={payout._id} className="transition hover:bg-gray-50/60">
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {formatMoney(payout.amount)}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {METHOD_LABELS[payout.method] || payout.method}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={payout.status} />
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-500">
                      {payout.reference || "—"}
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-500">
                      {formatDateTime(payout.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      {payout.status === "pending" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          loading={cancellingId === payout._id}
                          onClick={() => handleCancel(payout._id)}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 border-t border-gray-100 px-4 py-4">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Request payout modal */}
      <Modal
        isOpen={requestOpen}
        onClose={() => setRequestOpen(false)}
        title="Request Payout"
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
            Available balance:{" "}
            <span className="font-semibold">
              {formatMoney(summary?.available)}
            </span>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Amount (PKR)
            </label>
            <input
              type="number"
              min="1"
              max={summary?.available || undefined}
              value={form.amount}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, amount: event.target.value }))
              }
              placeholder="0"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-green-600"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              value={form.method}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, method: event.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-green-600"
            >
              <option value="bank">Bank Transfer</option>
              <option value="jazzcash">JazzCash</option>
              <option value="easypaisa">EasyPaisa</option>
            </select>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={submitting}
            leftIcon={<Wallet size={18} />}
          >
            Submit Request
          </Button>
        </form>
      </Modal>
    </div>
  );
}
