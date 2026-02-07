// Wishes Moderation Page
// Halaman untuk moderasi ucapan dari tamu

"use client";

import { useState, useEffect } from "react";

/**
 * Interface untuk data Wish
 */
interface Wish {
    id: number;
    message: string;
    isApproved: boolean;
    createdAt: string;
    guest: {
        name: string;
    };
}

/**
 * WishesPage Component
 * Halaman moderasi ucapan tamu
 */
export default function WishesPage() {
    const [wishes, setWishes] = useState<Wish[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

    /**
     * Fetch daftar ucapan dari API
     */
    useEffect(() => {
        fetchWishes();
    }, []);

    /**
     * Fungsi untuk fetch daftar ucapan
     */
    async function fetchWishes() {
        try {
            const response = await fetch("/api/wishes?all=true");
            if (response.ok) {
                const data = await response.json();
                setWishes(data);
            }
        } catch (error) {
            console.error("Error fetching wishes:", error);
        } finally {
            setIsLoading(false);
        }
    }

    /**
     * Toggle status approval ucapan
     */
    async function toggleApproval(id: number, currentStatus: boolean) {
        try {
            const response = await fetch(`/api/wishes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isApproved: !currentStatus }),
            });

            if (response.ok) {
                setWishes((prev) =>
                    prev.map((wish) =>
                        wish.id === id ? { ...wish, isApproved: !currentStatus } : wish
                    )
                );
            }
        } catch (error) {
            console.error("Error updating wish:", error);
        }
    }

    /**
     * Hapus ucapan
     */
    async function deleteWish(id: number) {
        if (!confirm("Apakah Anda yakin ingin menghapus ucapan ini?")) return;

        try {
            const response = await fetch(`/api/wishes/${id}`, { method: "DELETE" });
            if (response.ok) {
                setWishes((prev) => prev.filter((wish) => wish.id !== id));
            }
        } catch (error) {
            console.error("Error deleting wish:", error);
        }
    }

    /**
     * Filter ucapan berdasarkan status
     */
    const filteredWishes = wishes.filter((wish) => {
        if (filter === "pending") return !wish.isApproved;
        if (filter === "approved") return wish.isApproved;
        return true;
    });

    /**
     * Count untuk statistik
     */
    const pendingCount = wishes.filter((w) => !w.isApproved).length;
    const approvedCount = wishes.filter((w) => w.isApproved).length;

    /**
     * Approve semua ucapan sekaligus
     */
    async function approveAll() {
        if (pendingCount === 0) return;
        if (!confirm(`Apakah Anda yakin ingin menyetujui ${pendingCount} ucapan?`)) return;

        try {
            const response = await fetch("/api/wishes/approve-all", {
                method: "PUT",
            });

            if (response.ok) {
                // Update state lokal
                setWishes((prev) =>
                    prev.map((wish) => ({ ...wish, isApproved: true }))
                );
            }
        } catch (error) {
            console.error("Error approving all wishes:", error);
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E91E8C] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Page Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-[#5C4A3D]">Ucapan</h1>
                    <p className="text-[#A89080] mt-1">Moderasi ucapan dari tamu undangan</p>
                </div>
                {pendingCount > 0 && (
                    <button
                        onClick={approveAll}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Approve All ({pendingCount})
                    </button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <button
                    onClick={() => setFilter("all")}
                    className={`p-4 rounded-xl text-center transition-colors ${filter === "all"
                        ? "bg-[#E91E8C] text-white"
                        : "bg-white text-[#5C4A3D] hover:bg-[#F5E6E0]"
                        }`}
                >
                    <p className="text-2xl font-bold">{wishes.length}</p>
                    <p className="text-sm">Total</p>
                </button>
                <button
                    onClick={() => setFilter("pending")}
                    className={`p-4 rounded-xl text-center transition-colors ${filter === "pending"
                        ? "bg-yellow-500 text-white"
                        : "bg-white text-[#5C4A3D] hover:bg-[#F5E6E0]"
                        }`}
                >
                    <p className="text-2xl font-bold">{pendingCount}</p>
                    <p className="text-sm">Pending</p>
                </button>
                <button
                    onClick={() => setFilter("approved")}
                    className={`p-4 rounded-xl text-center transition-colors ${filter === "approved"
                        ? "bg-green-500 text-white"
                        : "bg-white text-[#5C4A3D] hover:bg-[#F5E6E0]"
                        }`}
                >
                    <p className="text-2xl font-bold">{approvedCount}</p>
                    <p className="text-sm">Approved</p>
                </button>
            </div>

            {/* Wishes List */}
            <div className="space-y-4">
                {filteredWishes.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center text-[#A89080]">
                        <svg
                            className="w-16 h-16 mx-auto mb-4 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                        </svg>
                        <p>Tidak ada ucapan yang ditemukan</p>
                    </div>
                ) : (
                    filteredWishes.map((wish) => (
                        <div
                            key={wish.id}
                            className={`bg-white rounded-xl p-5 shadow-sm border-l-4 ${wish.isApproved ? "border-green-500" : "border-yellow-400"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-semibold text-[#5C4A3D]">
                                        {wish.guest.name}
                                    </h3>
                                    <p className="text-xs text-[#A89080]">
                                        {new Date(wish.createdAt).toLocaleString("id-ID")}
                                    </p>
                                </div>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${wish.isApproved
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {wish.isApproved ? "Approved" : "Pending"}
                                </span>
                            </div>
                            <p className="text-[#5C4A3D] mb-4 whitespace-pre-wrap">
                                {wish.message}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleApproval(wish.id, wish.isApproved)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${wish.isApproved
                                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                        : "bg-green-100 text-green-700 hover:bg-green-200"
                                        }`}
                                >
                                    {wish.isApproved ? "Batalkan Approve" : "Approve"}
                                </button>
                                <button
                                    onClick={() => deleteWish(wish.id)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
