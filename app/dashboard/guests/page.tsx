// Guests Management Page
// CRUD untuk mengelola daftar tamu undangan dengan fitur download undangan

"use client";

import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import InvitationCard from "@/components/invitation/InvitationCard";

/**
 * Interface untuk data Guest
 */
interface Guest {
    id: number;
    name: string;
    phoneNumber: string | null;
    category: string;
    slug: string;
    qrCodeString: string;
    rsvpStatus: string;
    guestCount: number;
    checkInTime: string | null;
    giftType: string | null;
}

/**
 * Interface untuk Event Settings
 */
interface EventSettings {
    partner1Name: string;
    partner2Name: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    venueName: string;
    venueAddress: string;
}

/**
 * Interface untuk Theme Settings
 */
interface ThemeSettings {
    primaryColor: string;
}

/**
 * GuestsPage Component
 * Halaman CRUD untuk manajemen tamu undangan
 */
export default function GuestsPage() {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [downloadingGuest, setDownloadingGuest] = useState<Guest | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        category: "Regular",
    });
    const [eventSettings, setEventSettings] = useState<EventSettings | null>(null);
    const [themeSettings, setThemeSettings] = useState<ThemeSettings | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    /**
     * Fetch daftar tamu dan settings dari API
     */
    useEffect(() => {
        fetchGuests();
        fetchEventSettings();
        fetchThemeSettings();
    }, []);

    /**
     * Fungsi untuk fetch daftar tamu
     */
    async function fetchGuests() {
        try {
            const response = await fetch("/api/guests");
            if (response.ok) {
                const data = await response.json();
                setGuests(data);
            }
        } catch (error) {
            console.error("Error fetching guests:", error);
        } finally {
            setIsLoading(false);
        }
    }

    /**
     * Fungsi untuk fetch event settings
     */
    async function fetchEventSettings() {
        try {
            const response = await fetch("/api/event-settings");
            if (response.ok) {
                const data = await response.json();
                setEventSettings(data);
            }
        } catch (error) {
            console.error("Error fetching event settings:", error);
        }
    }

    /**
     * Fungsi untuk fetch theme settings
     */
    async function fetchThemeSettings() {
        try {
            const response = await fetch("/api/theme-settings");
            if (response.ok) {
                const data = await response.json();
                setThemeSettings(data);
            }
        } catch (error) {
            console.error("Error fetching theme settings:", error);
        }
    }

    /**
     * Handle perubahan input form
     */
    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    /**
     * Handle submit form (Create/Update)
     */
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const url = editingGuest
                ? `/api/guests/${editingGuest.id}`
                : "/api/guests";
            const method = editingGuest ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                fetchGuests();
                closeModal();
            }
        } catch (error) {
            console.error("Error saving guest:", error);
        }
    }

    /**
     * Handle delete tamu
     */
    async function handleDelete(id: number) {
        if (!confirm("Apakah Anda yakin ingin menghapus tamu ini?")) return;

        try {
            const response = await fetch(`/api/guests/${id}`, { method: "DELETE" });
            if (response.ok) {
                setGuests((prev) => prev.filter((g) => g.id !== id));
            }
        } catch (error) {
            console.error("Error deleting guest:", error);
        }
    }

    /**
     * Buka modal untuk edit tamu
     */
    function openEditModal(guest: Guest) {
        setEditingGuest(guest);
        setFormData({
            name: guest.name,
            phoneNumber: guest.phoneNumber || "",
            category: guest.category,
        });
        setShowModal(true);
    }

    /**
     * Buka modal untuk tambah tamu baru
     */
    function openAddModal() {
        setEditingGuest(null);
        setFormData({ name: "", phoneNumber: "", category: "Regular" });
        setShowModal(true);
    }

    /**
     * Tutup modal
     */
    function closeModal() {
        setShowModal(false);
        setEditingGuest(null);
        setFormData({ name: "", phoneNumber: "", category: "Regular" });
    }

    /**
     * Buka modal download undangan
     */
    function openDownloadModal(guest: Guest) {
        setDownloadingGuest(guest);
        setShowDownloadModal(true);
    }

    /**
     * Tutup modal download
     */
    function closeDownloadModal() {
        setShowDownloadModal(false);
        setDownloadingGuest(null);
    }

    /**
     * Download undangan sebagai gambar atau PDF
     */
    async function handleDownload(format: "png" | "jpg" | "pdf") {
        if (!cardRef.current || !downloadingGuest) return;

        setIsDownloading(true);

        try {
            // Generate canvas dari HTML
            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                backgroundColor: "#FFFAF5",
                useCORS: true,
            });

            const fileName = `undangan-${downloadingGuest.name.replace(/\s+/g, "-").toLowerCase()}`;

            if (format === "pdf") {
                // Generate PDF
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF({
                    orientation: "portrait",
                    unit: "px",
                    format: [canvas.width / 2, canvas.height / 2],
                });
                pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
                pdf.save(`${fileName}.pdf`);
            } else {
                // Generate image
                const link = document.createElement("a");
                link.download = `${fileName}.${format}`;
                link.href = canvas.toDataURL(`image/${format === "jpg" ? "jpeg" : "png"}`);
                link.click();
            }

            closeDownloadModal();
        } catch (error) {
            console.error("Error generating download:", error);
            alert("Gagal membuat undangan. Silakan coba lagi.");
        } finally {
            setIsDownloading(false);
        }
    }

    /**
     * Copy link undangan ke clipboard
     */
    function copyInvitationLink(slug: string) {
        const link = `${window.location.origin}/invite/${slug}`;
        navigator.clipboard.writeText(link);
        alert("Link undangan berhasil disalin!");
    }

    /**
     * Filter tamu berdasarkan pencarian dan kategori
     */
    const filteredGuests = guests.filter((guest) => {
        const matchesSearch = guest.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesCategory =
            categoryFilter === "all" || guest.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    /**
     * Render status badge
     */
    function StatusBadge({ status }: { status: string }) {
        const colors: Record<string, string> = {
            Pending: "bg-yellow-100 text-yellow-800",
            Coming: "bg-green-100 text-green-800",
            "Not Coming": "bg-red-100 text-red-800",
        };

        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"
                    }`}
            >
                {status}
            </span>
        );
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
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-[#5C4A3D]">Daftar Tamu</h1>
                    <p className="text-[#A89080] mt-1">
                        Total: {guests.length} tamu undangan
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="px-4 py-2 bg-[#E91E8C] text-white rounded-lg hover:bg-[#D91A7C] transition-colors flex items-center gap-2"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Tambah Tamu
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-6 flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Cari nama tamu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-[#E5D5C5] rounded-lg focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 border border-[#E5D5C5] rounded-lg focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none bg-white"
                >
                    <option value="all">Semua Kategori</option>
                    <option value="VIP">VIP</option>
                    <option value="Regular">Regular</option>
                </select>
            </div>

            {/* Guests Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#F5E6E0]">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-[#5C4A3D]">
                                    Nama
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-[#5C4A3D]">
                                    No. HP
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-[#5C4A3D]">
                                    Kategori
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-[#5C4A3D]">
                                    RSVP
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-[#5C4A3D]">
                                    Check-in
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-[#5C4A3D]">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0E6E0]">
                            {filteredGuests.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-8 text-center text-[#A89080]"
                                    >
                                        Tidak ada tamu yang ditemukan
                                    </td>
                                </tr>
                            ) : (
                                filteredGuests.map((guest) => (
                                    <tr key={guest.id} className="hover:bg-[#FAF7F5]">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-[#5C4A3D]">
                                                    {guest.name}
                                                </p>
                                                <p className="text-xs text-[#A89080]">
                                                    Slug: {guest.slug}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[#5C4A3D]">
                                            {guest.phoneNumber || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${guest.category === "VIP"
                                                    ? "bg-[#E91E8C] text-white"
                                                    : "bg-[#E5D5C5] text-[#5C4A3D]"
                                                    }`}
                                            >
                                                {guest.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={guest.rsvpStatus} />
                                        </td>
                                        <td className="px-6 py-4">
                                            {guest.checkInTime ? (
                                                <span className="text-green-600 text-sm">✓ Hadir</span>
                                            ) : (
                                                <span className="text-[#A89080] text-sm">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {/* Copy Link Button */}
                                                <button
                                                    onClick={() => copyInvitationLink(guest.slug)}
                                                    className="p-2 text-[#8B7355] hover:bg-[#F5E6E0] rounded-lg transition-colors"
                                                    title="Salin Link Undangan"
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                                        />
                                                    </svg>
                                                </button>
                                                {/* Download Button */}
                                                <button
                                                    onClick={() => openDownloadModal(guest)}
                                                    className="p-2 text-[#E91E8C] hover:bg-[#F5E6E0] rounded-lg transition-colors"
                                                    title="Download Undangan"
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                        />
                                                    </svg>
                                                </button>
                                                {/* Edit Button */}
                                                <button
                                                    onClick={() => openEditModal(guest)}
                                                    className="p-2 text-[#8B7355] hover:bg-[#F5E6E0] rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                        />
                                                    </svg>
                                                </button>
                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDelete(guest.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-semibold text-[#5C4A3D] mb-4">
                            {editingGuest ? "Edit Tamu" : "Tambah Tamu Baru"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#5C4A3D] mb-2">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-[#E5D5C5] rounded-lg focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                                        placeholder="Nama tamu"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5C4A3D] mb-2">
                                        Nomor HP (WhatsApp)
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-[#E5D5C5] rounded-lg focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                                        placeholder="08xxxxxxxxxx"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5C4A3D] mb-2">
                                        Kategori
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-[#E5D5C5] rounded-lg focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none bg-white"
                                    >
                                        <option value="Regular">Regular</option>
                                        <option value="VIP">VIP</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-3 border border-[#E5D5C5] text-[#5C4A3D] rounded-lg hover:bg-[#F5E6E0] transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-[#E91E8C] text-white rounded-lg hover:bg-[#D91A7C] transition-colors"
                                >
                                    {editingGuest ? "Simpan" : "Tambah"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Download Modal */}
            {showDownloadModal && downloadingGuest && eventSettings && themeSettings && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
                        <div className="flex justify-center items-center mb-4">
                            <h2 className="text-xl font-semibold text-[#5C4A3D]">
                                Download Undangan
                            </h2>
                        </div>

                        {/* Preview Card */}
                        <div className="flex justify-center mb-6 bg-gray-100 rounded-lg p-4 overflow-hidden">
                            <InvitationCard
                                ref={cardRef}
                                guestName={downloadingGuest.name}
                                partner1Name={eventSettings.partner1Name}
                                partner2Name={eventSettings.partner2Name}
                                eventDate={eventSettings.eventDate}
                                startTime={eventSettings.startTime}
                                endTime={eventSettings.endTime}
                                venueName={eventSettings.venueName}
                                venueAddress={eventSettings.venueAddress}
                                primaryColor={themeSettings.primaryColor}
                                category={downloadingGuest.category}
                                qrCodeString={downloadingGuest.qrCodeString}
                            />
                        </div>

                        {/* Download Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => handleDownload("png")}
                                disabled={isDownloading}
                                className="flex-1 px-4 py-3 bg-[#E91E8C] text-white rounded-lg hover:bg-[#D91A7C] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDownloading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                )}
                                PNG
                            </button>
                            <button
                                onClick={() => handleDownload("jpg")}
                                disabled={isDownloading}
                                className="flex-1 px-4 py-3 bg-[#5C4A3D] text-white rounded-lg hover:bg-[#4A3A2F] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDownloading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                )}
                                JPG
                            </button>
                            <button
                                onClick={() => handleDownload("pdf")}
                                disabled={isDownloading}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDownloading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                )}
                                PDF
                            </button>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={closeDownloadModal}
                            className="w-full mt-3 px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
