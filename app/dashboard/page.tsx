import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
    let stats = {
        totalGuests: 0,
        vipGuests: 0,
        regularGuests: 0,
        rsvpComing: 0,
        rsvpNotComing: 0,
        rsvpPending: 0,
        checkedIn: 0,
        totalWishes: 0,
        approvedWishes: 0,
    };

    try {
        stats.totalGuests = await prisma.guest.count();

        stats.vipGuests = await prisma.guest.count({
            where: { category: "VIP" },
        });
        stats.regularGuests = await prisma.guest.count({
            where: { category: "Regular" },
        });

        stats.rsvpComing = await prisma.guest.count({
            where: { rsvpStatus: "Coming" },
        });
        stats.rsvpNotComing = await prisma.guest.count({
            where: { rsvpStatus: "Not Coming" },
        });
        stats.rsvpPending = await prisma.guest.count({
            where: { rsvpStatus: "Pending" },
        });

        stats.checkedIn = await prisma.guest.count({
            where: { checkInTime: { not: null } },
        });

        stats.totalWishes = await prisma.wish.count();
        stats.approvedWishes = await prisma.wish.count({
            where: { isApproved: true },
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-[#5C4A3D]">Dashboard</h1>
                <p className="text-[#A89080] mt-1">
                    Selamat datang di Wedding Invitation Dashboard
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Tamu"
                    value={stats.totalGuests}
                    icon={
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    }
                    color="bg-[#E91E8C]"
                />

                <StatCard
                    title="Konfirmasi Hadir"
                    value={stats.rsvpComing}
                    icon={
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    }
                    color="bg-green-500"
                />

                <StatCard
                    title="Sudah Check-in"
                    value={stats.checkedIn}
                    icon={
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                            />
                        </svg>
                    }
                    color="bg-blue-500"
                />

                <StatCard
                    title="Ucapan"
                    value={stats.approvedWishes}
                    subValue={`/ ${stats.totalWishes} total`}
                    icon={
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                        </svg>
                    }
                    color="bg-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#5C4A3D] mb-4">
                        Status RSVP
                    </h2>
                    <div className="space-y-4">
                        <ProgressBar
                            label="Hadir"
                            value={stats.rsvpComing}
                            total={stats.totalGuests}
                            color="bg-green-500"
                        />
                        <ProgressBar
                            label="Tidak Hadir"
                            value={stats.rsvpNotComing}
                            total={stats.totalGuests}
                            color="bg-red-400"
                        />
                        <ProgressBar
                            label="Pending"
                            value={stats.rsvpPending}
                            total={stats.totalGuests}
                            color="bg-yellow-400"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#5C4A3D] mb-4">
                        Kategori Tamu
                    </h2>
                    <div className="flex items-center justify-around">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-[#E91E8C] flex items-center justify-center text-white text-2xl font-bold mb-2">
                                {stats.vipGuests}
                            </div>
                            <p className="text-[#5C4A3D] font-medium">VIP</p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-[#8B7355] flex items-center justify-center text-white text-2xl font-bold mb-2">
                                {stats.regularGuests}
                            </div>
                            <p className="text-[#5C4A3D] font-medium">Regular</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: number;
    subValue?: string;
    icon: React.ReactNode;
    color: string;
}

function StatCard({ title, value, subValue, icon, color }: StatCardProps) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-[#A89080] mb-1">{title}</p>
                    <p className="text-3xl font-bold text-[#5C4A3D]">
                        {value}
                        {subValue && (
                            <span className="text-sm font-normal text-[#A89080] ml-1">
                                {subValue}
                            </span>
                        )}
                    </p>
                </div>
                <div className={`p-3 rounded-full ${color} text-white`}>{icon}</div>
            </div>
        </div>
    );
}

interface ProgressBarProps {
    label: string;
    value: number;
    total: number;
    color: string;
}

function ProgressBar({ label, value, total, color }: ProgressBarProps) {
    const percentage = total > 0 ? (value / total) * 100 : 0;

    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-[#5C4A3D]">{label}</span>
                <span className="text-[#A89080]">
                    {value} ({percentage.toFixed(0)}%)
                </span>
            </div>
            <div className="h-2 bg-[#F5E6E0] rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
