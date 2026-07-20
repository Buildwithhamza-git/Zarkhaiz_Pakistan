import { CheckCircle2, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../../shared/components/ui/button";

export default function SellerPendingApproval() {
    return (
        <section className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-10 text-center">

                <div className="flex justify-center">
                    <CheckCircle2
                        size={80}
                        className="text-green-600"
                    />
                </div>

                <h1 className="text-4xl font-bold text-green-800 mt-6">
                    Application Submitted Successfully
                </h1>

                <p className="mt-4 text-gray-600 text-lg leading-8">
                    Thank you for applying to become a seller on
                    <span className="font-semibold text-green-700">
                        {" "}Zarkhaiz Pakistan
                    </span>.
                </p>

                <div className="mt-8 rounded-2xl bg-green-50 border border-green-200 p-6">

                    <div className="flex justify-center mb-4">
                        <Clock3
                            className="text-green-700"
                            size={40}
                        />
                    </div>

                    <h2 className="text-2xl font-semibold text-green-800">
                        Verification In Progress
                    </h2>

                    <p className="text-gray-600 mt-3 leading-7">
                        Your seller application has been received successfully.
                        Our team will review your documents and verify your
                        information.
                    </p>

                    <p className="mt-5 font-medium text-green-700">
                        Estimated approval time:
                    </p>

                    <p className="text-2xl font-bold text-green-800">
                        2–3 Working Days
                    </p>

                </div>

                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">

                    <p className="text-yellow-800 font-semibold">
                        Current Status
                    </p>

                    <span className="inline-flex items-center mt-3 rounded-full bg-yellow-100 px-5 py-2 text-yellow-700 font-semibold">
                        🟡 Pending Approval
                    </span>

                </div>

                <p className="mt-8 text-gray-500">
                    Once your application is approved, you'll automatically gain
                    access to your Seller Dashboard.
                </p>

                <div className="mt-10">

                    <Link to="/">
                        <Button>
                            Back to Home
                        </Button>
                    </Link>

                </div>

            </div>

        </section>
    );
}