import { ShieldCheck } from "lucide-react";

import ChangePasswordCard from "./ChangePasswordCard";
import DeleteAccountCard from "./DeleteAccountCard";

export default function AccountSettings() {
    return (
        <div className="bg-white rounded-2xl border p-6">
            <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-10 rounded-full bg-green-50 text-green-700 flex items-center justify-center">
                    <ShieldCheck size={20} />
                </span>
                <div>
                    <h3 className="font-bold text-gray-900">Account Settings</h3>
                    <p className="text-sm text-gray-500">Manage your account security</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-4">
                <ChangePasswordCard />
                <DeleteAccountCard />
            </div>
        </div>
    );
}
