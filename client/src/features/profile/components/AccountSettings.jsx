import { ShieldCheck } from "lucide-react";

import ChangePasswordCard from "./ChangePasswordCard";
import DeleteAccountCard from "./DeleteAccountCard";

export default function AccountSettings() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}

      <div className="border-b border-gray-100 p-6">
        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
            <ShieldCheck
              size={22}
              className="text-green-700"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Account Settings
            </h2>

            <p className="text-sm text-gray-500">
              Manage your account security.
            </p>
          </div>

        </div>
      </div>

      {/* Cards */}

      <div className="grid gap-5 p-6 md:grid-cols-2">

        <ChangePasswordCard />

        <DeleteAccountCard />

      </div>

    </div>
  );
}