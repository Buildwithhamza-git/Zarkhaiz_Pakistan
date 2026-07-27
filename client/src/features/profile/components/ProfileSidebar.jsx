import { User, Calendar, BadgeCheck, Store } from "lucide-react";

export default function ProfileSidebar({ user }) {
    console.log(user.isVerified);
  if (!user) return null;
  

  const initials = `${user.firstname?.[0] || ""}${user.lastname?.[0] || ""}`.toUpperCase();

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">

      {/* Initials */}
      <div className="flex justify-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-green-600 text-4xl font-bold text-white shadow">
          {initials}
        </div>
      </div>

      {/* Name */}
      <div className="mt-5 text-center">
        <h2 className="text-xl font-bold text-gray-900">
          {user.firstname} {user.lastname}
        </h2>

        <p className="mt-1 text-sm text-gray-500 capitalize">
          {user.role}
        </p>
      </div>

      {/* Verification */}
      <div className="mt-6 space-y-3">

        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <BadgeCheck className="text-green-600" size={18} />
            <span className="text-sm font-medium">
              Verification
            </span>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              user.isVerified
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {user.isVerified ? "Verified" : "Not Verified"}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <Store size={18} className="text-green-600" />
            <span className="text-sm font-medium">
              Seller Status
            </span>
          </div>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
            {user.sellerStatus}
          </span>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <Calendar size={18} className="text-green-600" />

          <div>
            <p className="text-xs text-gray-500">
              Member Since
            </p>

            <p className="font-semibold text-gray-900">
              {memberSince}
            </p>
          </div>
        </div>

      </div>

      {/* Quote */}
      <div className="mt-6 rounded-xl bg-green-50 p-4 text-center">
        <User className="mx-auto mb-2 text-green-600" size={22} />

        <p className="text-sm text-gray-600">
          Keep your account information up to date to enjoy a secure and smooth experience on <span className="font-semibold text-green-700">Zarkhaiz Pakistan</span>.
        </p>
      </div>

    </div>
  );
}