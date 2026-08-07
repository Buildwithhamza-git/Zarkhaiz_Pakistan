import {
  Banknote,
  CreditCard,
  History,
  Landmark,
  Wallet,
} from "lucide-react";

import Card from "../../../../shared/components/ui/Card";
import Button from "../../../../shared/components/ui/button";
import { formatMoney } from "../../../order/utils/orderDisplay";

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-14 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
      <Icon size={26} className="text-gray-400" />
    </div>

    <h4 className="mt-4 font-semibold text-gray-700">{title}</h4>

    <p className="mx-auto mt-1 max-w-sm text-sm text-gray-400">
      {description}
    </p>

    {action && <div className="mt-5">{action}</div>}
  </div>
);

const PayoutsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
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
              {formatMoney(0)}
            </h2>

            <p className="mt-2 text-sm text-green-100">
              Your earnings will be available here after orders are delivered.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/15 pt-5 text-sm">
              <div>
                <p className="text-green-200">Pending Clearance</p>
                <p className="mt-1 font-semibold">{formatMoney(0)}</p>
              </div>

              <div>
                <p className="text-green-200">Withdrawn This Month</p>
                <p className="mt-1 font-semibold">{formatMoney(0)}</p>
              </div>

              <div>
                <p className="text-green-200">Commission Paid</p>
                <p className="mt-1 font-semibold">{formatMoney(0)}</p>
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

          <div className="flex-1">
            <EmptyState
              icon={CreditCard}
              title="No payout method added"
              description="Add a bank account, JazzCash or EasyPaisa to receive your payouts."
              action={
                <Button variant="primary" size="sm">
                  Add Payout Method
                </Button>
              }
            />
          </div>
        </Card>
      </div>

      {/* Payout history */}
      <Card>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800">Payout History</h3>

          <p className="mt-0.5 text-xs text-gray-400">
            Records of all your withdrawals and settlements
          </p>
        </div>

        <EmptyState
          icon={History}
          title="No payouts yet"
          description="Once you request your first withdrawal, it will show up here."
        />
      </Card>
    </div>
  );
};

export default PayoutsPage;
