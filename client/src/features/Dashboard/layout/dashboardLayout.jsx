import DashboardHeader from "../components/DashboardHeader";

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">

            <DashboardHeader />

            <main className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </main>

        </div>
    );
}