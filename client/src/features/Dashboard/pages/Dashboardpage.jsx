import DashboardLayout from "../layout/dashboardLayout";

import useAuthContext from "../../../hooks/useAuth";
export default function DashboardPage() {
    const {user}=useAuthContext()
    return (
        <DashboardLayout>

            <div className="space-y-8">

                <div>

                    <h1 className="text-4xl font-bold text-green-800">
                        Welcome Back  {user
                                    ? `${user.firstname} ${user.lastname}`
                                    : "Guest"}👋
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Manage your agriculture marketplace from one place.
                    </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="rounded-2xl bg-white p-6 shadow border border-green-100">

                        <h2 className="text-xl font-semibold text-green-700">
                            Crops
                        </h2>

                        <p className="mt-3 text-gray-600">
                            Total Crops
                        </p>

                        <h3 className="text-4xl font-bold mt-3">
                            0
                        </h3>

                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow border border-green-100">

                        <h2 className="text-xl font-semibold text-yellow-700">
                            Orders
                        </h2>

                        <p className="mt-3 text-gray-600">
                            Pending Orders
                        </p>

                        <h3 className="text-4xl font-bold mt-3">
                            0
                        </h3>

                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow border border-green-100">

                        <h2 className="text-xl font-semibold text-green-700">
                            Revenue
                        </h2>

                        <p className="mt-3 text-gray-600">
                            Total Revenue
                        </p>

                        <h3 className="text-4xl font-bold mt-3">
                            Rs. 0
                        </h3>

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}