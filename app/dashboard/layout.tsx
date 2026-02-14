import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-[#FAF7F5]">
            <div className="flex">
                <Sidebar userName={session.user.name || "Admin"} />

                <main className="flex-1 lg:ml-64 min-w-0">
                    <div className="p-4 pt-20 lg:p-8 lg:pt-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
