// Dashboard Layout dengan Sidebar
// Server Component yang membungkus seluruh halaman dashboard

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/dashboard/Sidebar";

/**
 * Dashboard Layout Component
 * Layout utama untuk semua halaman dashboard dengan sidebar navigasi
 */
export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Cek autentikasi
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-[#FAF7F5]">
            <div className="flex">
                {/* Sidebar */}
                <Sidebar userName={session.user.name || "Admin"} />

                {/* Main Content - Responsif dengan padding untuk mobile header */}
                <main className="flex-1 lg:ml-64 min-w-0">
                    <div className="p-4 pt-20 lg:p-8 lg:pt-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
