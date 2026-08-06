import { useState } from "react";
import toast from "react-hot-toast";
import {
  Banknote,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
  Landmark,
  Plus,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import Badge from "../../../../shared/components/Badge";
import Button from "../../../../shared/components/ui/button";
import Card from "../../../../shared/components/ui/Card";
import Modal from "../../../../shared/components/ui/Modal";
import { formatMoney } from "../../../order/utils/orderDisplay";

const payoutHistory = [
  {
    id: "P-1024",
    date: "Aug 01, 2026",
    amount: 45000,
    method: "Bank Transfer - Meezan Bank",
    status: "Completed",
  },
  {
    id: "P-1019",
    date: "Jul 18, 2026",
    amount: 38200,
    method: "Bank Transfer - Meezan Bank",
    status: "Completed",
  },
  {
    id: "P-1015",
    date: "Jul 04, 2026",
    amount: 29750,
    method: "Bank Transfer - Meezan Bank",
    status: "Completed",
  },
  {
    id: "P-1012",
    date: "Jun 20, 2026",
    amount: 26400,
    method: "Bank Transfer - Meezan Bank",
    status: "Completed",
  },
  {
    id: "P-1008",
    date: "Jun 06, 2026",
    amount: 18550,
    method: "JazzCash - 0333****890",
    status: "Processing",
  },
  {
    id: "P-1004",
    date: "May 25, 2026",
    amount: 12600,
    method: "Bank Transfer - Meezan Bank",
    status: "Failed",
  },
];

const statusTone = {
  Completed: "green",
  Processing: "blue",
  Pending: "yellow",
  Failed: "red",
  Cancelled: "gray",
};

const PayoutsPage = () => {
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank");
  const [submitting, setSubmitting] = useState(false);

  const availableBalance = 48700;

  const handleSubmit = () => {
    const value = Number(amount);

    if (!value || value <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (value > availableBalance) {
      toast.error("Amount exceeds your available balance.");
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setWithdrawModalOpen(false);
      setAmount("");
      toast.success("Payout request submitted successfully.");
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-green-100 p-2">
            <Banknote size={20} className="text-green-700" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Payouts</h1>

            <p className="mt-1 text-sm text-gray-500">
              Withdraw your earnings securely to your bank or wallet.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download size={16} />}
          >
            Download Statement
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={() => setWithdrawModalOpen(true)}
          >
            Withdraw Funds
          </Button>
        </div>
      </div>

      {/* Balance + Payout Method */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Available balance */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-700 to-green-900 p-6 text-white lg:col-span-2">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -right-4 h-36 w-36 rounded-full bg-white/10" />

          <div className="relative">
            <div className="flex items-center gap-2 text-green-100">
              <Wallet size={18} />
              <span className="text-sm font-medium">Available Balance</span>
            </div>

            <h2 className="mt-4 text-4xl font-bold">
              {formatMoney(availableBalance)}
            </h2>

            <p className="mt-2 text-sm text-green-100">
              Next settlement clears on{" "}
              <span className="font-semibold text-white">Aug 10, 2026</span>
            </p>

            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/15 pt-5 text-sm">
              <div>
                <p className="text-green-200">Pending Clearance</p>
                <p className="mt-1 font-semibold">
                  {formatMoney(15900)}
                </p>
              </div>

              <div>
                <p className="text-green-200">Withdrawn This Month</p>
                <p className="mt-1 font-semibold">{formatMoney(45000)}</p>
              </div>

              <div>
                <p className="text-green-200">Commission Paid</p>
                <p className="mt-1 font-semibold">{formatMoney(8230)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payout method */}
        <Card className="flex flex-col">
          <div className="flex items-center gap-2">
            <Landmark size={18} className="text-green-700" />
            <h3 className="font-semibold text-gray-800">Payout Method</h3>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-green-700 shadow-sm">
              <Building2 size={20} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800">
                Meezan Bank Limited
              </p>
              <p className="truncate text-xs text-gray-500">
                *** *** *** 4821
              </p>
            </div>

            <Badge color="green">Primary</Badge>
          </div>

          <div className="mt-3 flex items-center gap-3 rounded-xl border border-gray-200 p-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
              <Banknote size={20} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800">JazzCash</p>
              <p className="truncate text-xs text-gray-500">0333 *** 890</p>
            </div>

            <span className="text-xs text-gray-400">Secondary</span>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-gray-50 p-3 text-xs text-gray-500">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-green-600" />
            <p>
              Minimum payout is Rs. 1,000. Transfers settle within 2 business
              days.
            </p>
          </div>

          <div className="mt-auto pt-4">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              leftIcon={<Plus size={16} />}
              onClick={() => setWithdrawModalOpen(true)}
            >
              Add Payout Method
            </Button>
          </div>
        </Card>
      </div>

      {/* Payout history */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <h3 className="font-semibold text-gray-800">Payout History</h3>

            <p className="mt-0.5 text-xs text-gray-400">
              Records of all your withdrawals and settlements
            </p>
          </div>

          <Button variant="ghost" size="sm">
            <Calendar size={14} className="mr-1" />
            All Time
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-y border-gray-100 bg-gray-50/60 text-xs uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3.5 font-semibold">Payout ID</th>
                <th className="px-5 py-3.5 font-semibold">Date</th>
                <th className="px-5 py-3.5 font-semibold">Method</th>
                <th className="px-5 py-3.5 font-semibold">Amount</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {payoutHistory.map((payout) => (
                <tr
                  key={payout.id}
                  className="transition hover:bg-gray-50/60"
                >
                  <td className="px-5 py-4 font-semibold text-gray-900">
                    {payout.id}
                  </td>

                  <td className="px-5 py-4 text-xs text-gray-500">
                    {payout.date}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {payout.method}
                  </td>

                  <td className="px-5 py-4 font-semibold text-gray-900">
                    {formatMoney(payout.amount)}
                  </td>

                  <td className="px-5 py-4">
                    <Badge color={statusTone[payout.status] || "gray"}>
                      {payout.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-2 border-t border-gray-100 px-5 py-4 text-xs text-gray-400">
          <CheckCircle2 size={14} className="text-green-600" />
          Showing the last 6 payouts. Older records can be downloaded as a
          statement.
        </div>
      </div>

      {/* Withdraw Modal */}
      <Modal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        title="Withdraw Funds"
        size="sm"
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-green-50 p-4 text-sm">
            <p className="text-gray-500">Available balance</p>
            <p className="mt-1 text-2xl font-bold text-green-700">
              {formatMoney(availableBalance)}
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Amount (PKR)
            </label>

            <input
              type="number"
              min="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

            <p className="mt-1.5 text-xs text-gray-400">
              Minimum withdrawal is Rs. 1,000
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Payout method
            </label>

            <div className="space-y-2">
              {[
                {
                  id: "bank",
                  name: "Meezan Bank *** 4821",
                  icon: Building2,
                },
                {
                  id: "jazzcash",
                  name: "JazzCash 0333***890",
                  icon: Banknote,
                },
              ].map((m) => {
                const Icon = m.icon;

                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                      method === m.id
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        method === m.id
                          ? "bg-green-600 text-white"
                          : "bg-gray-50 text-gray-500"
                      }`}
                    >
                      <Icon size={18} />
                    </span>

                    <span className="text-sm font-medium text-gray-700">
                      {m.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            fullWidth
            size="md"
            loading={submitting}
            onClick={handleSubmit}
            leftIcon={!submitting && <Banknote size={16} />}
          >
            Submit Payout Request
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PayoutsPage;
