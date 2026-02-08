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
    const [selectedGuests, setSelectedGuests] = useState<number[]>([]);
    const [showBulkPrintModal, setShowBulkPrintModal] = useState(false);
    const [isBulkPrinting, setIsBulkPrinting] = useState(false);
    const [bulkPrintProgress, setBulkPrintProgress] = useState(0);

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
     * Toggle seleksi tamu untuk bulk print
     */
    function toggleGuestSelection(guestId: number) {
        setSelectedGuests(prev =>
            prev.includes(guestId)
                ? prev.filter(id => id !== guestId)
                : [...prev, guestId]
        );
    }

    /**
     * Select/Deselect semua tamu yang terfilter
     */
    function toggleSelectAll() {
        const filteredIds = filteredGuests.map(g => g.id);
        const allSelected = filteredIds.every(id => selectedGuests.includes(id));
        if (allSelected) {
            setSelectedGuests(prev => prev.filter(id => !filteredIds.includes(id)));
        } else {
            setSelectedGuests(prev => [...new Set([...prev, ...filteredIds])]);
        }
    }

    /**
     * Buka modal bulk print
     */
    function openBulkPrintModal() {
        if (selectedGuests.length === 0) {
            alert("Pilih minimal 1 tamu untuk dicetak");
            return;
        }
        setShowBulkPrintModal(true);
    }

    /**
     * Tutup modal bulk print
     */
    function closeBulkPrintModal() {
        setShowBulkPrintModal(false);
        setBulkPrintProgress(0);
    }

    /**
     * Generate PDF dengan banyak undangan (4 per halaman)
     */
    async function handleBulkPrint() {
        if (!eventSettings || !themeSettings) return;

        const guestsToPrint = guests.filter(g => selectedGuests.includes(g.id));
        if (guestsToPrint.length === 0) return;

        setIsBulkPrinting(true);
        setBulkPrintProgress(0);

        try {
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const cardsPerPage = 4;
            const cardWidth = 95;
            const cardHeight = 140;
            const margin = 5;
            const positions = [
                { x: margin, y: margin },
                { x: margin + cardWidth + margin, y: margin },
                { x: margin, y: margin + cardHeight + margin },
                { x: margin + cardWidth + margin, y: margin + cardHeight + margin },
            ];

            let cardIndex = 0;

            for (const guest of guestsToPrint) {
                // Create temporary card element
                const cardDiv = document.createElement("div");
                cardDiv.style.cssText = `
                    width: 400px;
                    min-height: 560px;
                    background-color: #FFFAF5;
                    font-family: 'Playfair Display', serif;
                    position: fixed;
                    left: -9999px;
                    padding: 20px;
                    box-sizing: border-box;
                `;
                cardDiv.innerHTML = `
                    <div style="border: 2px solid ${themeSettings.primaryColor}20; position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px;"></div>
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 30px 20px; text-align: center;">
                        <div style="background-color: ${themeSettings.primaryColor}; color: white; padding: 8px 24px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 24px;">
                            ${guest.category === "VIP" ? "VIP Guest" : "Special Guest"}: ${guest.name}
                        </div>
                        <p style="color: ${themeSettings.primaryColor}; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 16px; font-family: sans-serif;">Together With Their Families</p>
                        <h1 style="font-size: 42px; font-weight: 400; color: #2D2D2D; margin: 0 0 4px 0; line-height: 1.2;">${eventSettings.partner1Name}</h1>
                        <p style="font-size: 28px; color: #999; margin: 0 0 4px 0; font-style: italic;">&</p>
                        <h1 style="font-size: 42px; font-weight: 400; color: #2D2D2D; margin: 0 0 20px 0; line-height: 1.2;">${eventSettings.partner2Name}</h1>
                        <p style="font-size: 13px; color: #666; margin-bottom: 24px; line-height: 1.6; font-family: sans-serif;">Joyfully invite you to share in their<br/>happiness as they unite in marriage</p>
                        <h2 style="font-size: 18px; font-weight: 700; color: #2D2D2D; margin: 0 0 16px 0;">${new Date(eventSettings.eventDate).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</h2>
                        <div style="margin: 20px 0; padding: 16px; background: white; border-radius: 8px; display: inline-block; border: 1px solid ${themeSettings.primaryColor}20;">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(guest.qrCodeString)}" alt="QR" style="width: 80px; height: 80px;"/>
                        </div>
                        <p style="font-size: 12px; color: ${themeSettings.primaryColor}; font-weight: 600; font-family: monospace;">${guest.qrCodeString}</p>
                    </div>
                `;
                document.body.appendChild(cardDiv);

                // Wait for QR image to load
                await new Promise(resolve => setTimeout(resolve, 300));

                // Convert to canvas
                const canvas = await html2canvas(cardDiv, {
                    scale: 2,
                    backgroundColor: "#FFFAF5",
                    useCORS: true,
                });

                document.body.removeChild(cardDiv);

                // Add to PDF
                const imgData = canvas.toDataURL("image/png");
                const pos = positions[cardIndex % cardsPerPage];
                pdf.addImage(imgData, "PNG", pos.x, pos.y, cardWidth, cardHeight);

                cardIndex++;

                // Add new page if needed
                if (cardIndex % cardsPerPage === 0 && cardIndex < guestsToPrint.length) {
                    pdf.addPage();
                }

                // Update progress
                setBulkPrintProgress(Math.round((cardIndex / guestsToPrint.length) * 100));
            }

            pdf.save(`undangan-bulk-${new Date().toISOString().split("T")[0]}.pdf`);
            closeBulkPrintModal();
            setSelectedGuests([]);
        } catch (error) {
            console.error("Error generating bulk PDF:", error);
            alert("Gagal membuat PDF. Silakan coba lagi.");
        } finally {
            setIsBulkPrinting(false);
            setBulkPrintProgress(0);
        }
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-[#5C4A3D]">Daftar Tamu</h1>
                    <p className="text-[#A89080] mt-1">
                        Total: {guests.length} tamu undangan
                    </p>
                </div>
                <div className="flex gap-2">
                    {selectedGuests.length > 0 && (
                        <button
                            onClick={openBulkPrintModal}
                            className="px-4 py-2 bg-[#5C4A3D] text-white rounded-lg hover:bg-[#4A3A2F] transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Cetak ({selectedGuests.length})
                        </button>
                    )}
                    <button
                        onClick={openAddModal}
                        className="px-4 py-2 bg-[#E91E8C] text-white rounded-lg hover:bg-[#D91A7C] transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Tamu
                    </button>
                </div>
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
                                <th className="px-4 py-4 text-center">
                                    <input
                                        type="checkbox"
                                        checked={filteredGuests.length > 0 && filteredGuests.every(g => selectedGuests.includes(g.id))}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-gray-300 text-[#E91E8C] focus:ring-[#E91E8C]"
                                    />
                                </th>
                                <th className="px-4 py-4 text-left text-sm font-medium text-[#5C4A3D]">
                                    Nama
                                </th>
                                <th className="px-4 py-4 text-left text-sm font-medium text-[#5C4A3D] hidden md:table-cell">
                                    No. HP
                                </th>
                                <th className="px-4 py-4 text-left text-sm font-medium text-[#5C4A3D] hidden sm:table-cell">
                                    Kategori
                                </th>
                                <th className="px-4 py-4 text-left text-sm font-medium text-[#5C4A3D] hidden lg:table-cell">
                                    RSVP
                                </th>
                                <th className="px-4 py-4 text-left text-sm font-medium text-[#5C4A3D] hidden lg:table-cell">
                                    Check-in
                                </th>
                                <th className="px-4 py-4 text-right text-sm font-medium text-[#5C4A3D]">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0E6E0]">
                            {filteredGuests.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-8 text-center text-[#A89080]"
                                    >
                                        Tidak ada tamu yang ditemukan
                                    </td>
                                </tr>
                            ) : (
                                filteredGuests.map((guest) => (
                                    <tr key={guest.id} className="hover:bg-[#FAF7F5]">
                                        <td className="px-4 py-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedGuests.includes(guest.id)}
                                                onChange={() => toggleGuestSelection(guest.id)}
                                                className="w-4 h-4 rounded border-gray-300 text-[#E91E8C] focus:ring-[#E91E8C]"
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div>
                                                <p className="font-medium text-[#5C4A3D]">
                                                    {guest.name}
                                                </p>
                                                <p className="text-xs text-[#A89080]">
                                                    Slug: {guest.slug}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-[#5C4A3D] hidden md:table-cell">
                                            {guest.phoneNumber || "-"}
                                        </td>
                                        <td className="px-4 py-4 hidden sm:table-cell">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${guest.category === "VIP"
                                                    ? "bg-[#E91E8C] text-white"
                                                    : "bg-[#E5D5C5] text-[#5C4A3D]"
                                                    }`}
                                            >
                                                {guest.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 hidden lg:table-cell">
                                            <StatusBadge status={guest.rsvpStatus} />
                                        </td>
                                        <td className="px-4 py-4 hidden lg:table-cell">
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

            {/* Bulk Print Modal */}
            {showBulkPrintModal && eventSettings && themeSettings && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-[#E91E8C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-[#E91E8C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-[#5C4A3D] mb-2">
                                Cetak Undangan Massal
                            </h2>
                            <p className="text-[#A89080] text-sm">
                                {selectedGuests.length} undangan akan dicetak dalam format PDF (4 undangan per halaman A4)
                            </p>
                        </div>

                        {isBulkPrinting && (
                            <div className="mb-6">
                                <div className="flex justify-between text-sm text-[#5C4A3D] mb-2">
                                    <span>Memproses...</span>
                                    <span>{bulkPrintProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-[#E91E8C] h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${bulkPrintProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={closeBulkPrintModal}
                                disabled={isBulkPrinting}
                                className="flex-1 px-4 py-3 border border-[#E5D5C5] text-[#5C4A3D] rounded-lg hover:bg-[#F5E6E0] transition-colors disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleBulkPrint}
                                disabled={isBulkPrinting}
                                className="flex-1 px-4 py-3 bg-[#E91E8C] text-white rounded-lg hover:bg-[#D91A7C] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isBulkPrinting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Cetak PDF
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
