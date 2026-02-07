// Export & Print Page
// Halaman untuk export data dan generate kartu undangan

"use client";

import { useState, useEffect } from "react";

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
 * ExportPage Component
 * Halaman untuk export data dan generate kartu
 */
export default function ExportPage() {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [selectedGuests, setSelectedGuests] = useState<number[]>([]);

    /**
     * Fetch daftar tamu
     */
    useEffect(() => {
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
        fetchGuests();
    }, []);

    /**
     * Toggle select guest
     */
    function toggleSelectGuest(id: number) {
        setSelectedGuests((prev) =>
            prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
        );
    }

    /**
     * Select/Deselect all guests
     */
    function toggleSelectAll() {
        if (selectedGuests.length === guests.length) {
            setSelectedGuests([]);
        } else {
            setSelectedGuests(guests.map((g) => g.id));
        }
    }

    /**
     * Export data tamu ke CSV
     */
    async function exportToCSV() {
        setIsExporting(true);

        try {
            const dataToExport =
                selectedGuests.length > 0
                    ? guests.filter((g) => selectedGuests.includes(g.id))
                    : guests;

            const headers = [
                "Nama",
                "No HP",
                "Kategori",
                "RSVP Status",
                "Jumlah Tamu",
                "Check-in",
                "Kado",
                "Link Undangan",
            ];

            const rows = dataToExport.map((guest) => [
                guest.name,
                guest.phoneNumber || "",
                guest.category,
                guest.rsvpStatus,
                guest.guestCount.toString(),
                guest.checkInTime
                    ? new Date(guest.checkInTime).toLocaleString("id-ID")
                    : "",
                guest.giftType || "",
                `${window.location.origin}/invite/${guest.slug}`,
            ]);

            const csvContent = [
                headers.join(","),
                ...rows.map((row) =>
                    row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
                ),
            ].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `daftar-tamu-${new Date().toISOString().split("T")[0]}.csv`;
            link.click();
        } catch (error) {
            console.error("Error exporting CSV:", error);
            alert("Gagal export data");
        } finally {
            setIsExporting(false);
        }
    }

    /**
     * Generate invitation cards (akan membutuhkan library jspdf/html2canvas)
     */
    async function generateCards() {
        setIsExporting(true);

        try {
            const dataToExport =
                selectedGuests.length > 0
                    ? guests.filter((g) => selectedGuests.includes(g.id))
                    : guests;

            // Dynamic import untuk menghindari SSR issues
            const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
                import("jspdf"),
                import("html2canvas"),
            ]);

            const pdf = new jsPDF("p", "mm", "a4");
            const cardsPerPage = 4;
            let cardIndex = 0;

            for (const guest of dataToExport) {
                // Create card element
                const cardDiv = document.createElement("div");
                cardDiv.id = "card-temp";
                cardDiv.style.cssText = `
          width: 400px;
          padding: 30px;
          background: linear-gradient(135deg, #F5E6E0 0%, #FFFFFF 100%);
          border: 2px solid #D4A5A5;
          border-radius: 16px;
          text-align: center;
          font-family: 'Segoe UI', sans-serif;
        `;
                cardDiv.innerHTML = `
          <p style="color: #A89080; font-size: 12px; margin-bottom: 8px;">Undangan Pernikahan</p>
          <h2 style="color: #5C4A3D; font-size: 24px; margin-bottom: 16px;">${guest.name}</h2>
          <p style="color: #8B7355; font-size: 14px; margin-bottom: 16px;">Kategori: ${guest.category}</p>
          <div style="background: white; padding: 16px; border-radius: 8px; display: inline-block; margin-bottom: 16px;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(guest.qrCodeString)}" alt="QR Code" style="width: 150px; height: 150px;" />
          </div>
          <p style="color: #A89080; font-size: 10px;">Tunjukkan QR code ini saat registrasi</p>
        `;

                document.body.appendChild(cardDiv);

                // Wait for QR image to load
                await new Promise((resolve) => setTimeout(resolve, 500));

                // Convert to canvas
                const canvas = await html2canvas(cardDiv, {
                    scale: 2,
                    useCORS: true,
                });

                document.body.removeChild(cardDiv);

                // Add to PDF
                const imgData = canvas.toDataURL("image/png");
                const positions = [
                    { x: 10, y: 10 },
                    { x: 105, y: 10 },
                    { x: 10, y: 150 },
                    { x: 105, y: 150 },
                ];

                const pos = positions[cardIndex % cardsPerPage];
                pdf.addImage(imgData, "PNG", pos.x, pos.y, 90, 130);

                cardIndex++;

                // Add new page if needed
                if (cardIndex % cardsPerPage === 0 && cardIndex < dataToExport.length) {
                    pdf.addPage();
                }
            }

            pdf.save(`kartu-undangan-${new Date().toISOString().split("T")[0]}.pdf`);
        } catch (error) {
            console.error("Error generating cards:", error);
            alert("Gagal generate kartu undangan");
        } finally {
            setIsExporting(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D4A5A5] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-[#5C4A3D]">Export & Print</h1>
                <p className="text-[#A89080] mt-1">
                    Export data tamu dan generate kartu undangan
                </p>
            </div>

            {/* Export Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Export CSV */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <svg
                                className="w-6 h-6 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#5C4A3D]">Export ke CSV</h3>
                            <p className="text-sm text-[#A89080]">
                                Download data tamu dalam format CSV
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={exportToCSV}
                        disabled={isExporting}
                        className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                        {isExporting ? "Mengexport..." : "Export CSV"}
                    </button>
                </div>

                {/* Generate Cards */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-[#F5E6E0] rounded-lg">
                            <svg
                                className="w-6 h-6 text-[#D4A5A5]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#5C4A3D]">
                                Generate Kartu Undangan
                            </h3>
                            <p className="text-sm text-[#A89080]">
                                Buat kartu undangan dengan QR code
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={generateCards}
                        disabled={isExporting}
                        className="w-full py-3 bg-[#D4A5A5] text-white rounded-lg hover:bg-[#C49595] transition-colors disabled:opacity-50"
                    >
                        {isExporting ? "Generating..." : "Generate PDF"}
                    </button>
                </div>
            </div>

            {/* Guest Selection */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-[#5C4A3D]">
                        Pilih Tamu ({selectedGuests.length} / {guests.length} dipilih)
                    </h3>
                    <button
                        onClick={toggleSelectAll}
                        className="text-sm text-[#D4A5A5] hover:underline"
                    >
                        {selectedGuests.length === guests.length
                            ? "Batalkan Semua"
                            : "Pilih Semua"}
                    </button>
                </div>
                <p className="text-sm text-[#A89080] mb-4">
                    Jika tidak ada yang dipilih, semua tamu akan diexport
                </p>

                {/* Guest List */}
                <div className="max-h-[400px] overflow-y-auto space-y-2">
                    {guests.map((guest) => (
                        <label
                            key={guest.id}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedGuests.includes(guest.id)
                                    ? "bg-[#F5E6E0]"
                                    : "hover:bg-gray-50"
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedGuests.includes(guest.id)}
                                onChange={() => toggleSelectGuest(guest.id)}
                                className="w-5 h-5 rounded border-[#E5D5C5] text-[#D4A5A5] focus:ring-[#D4A5A5]"
                            />
                            <div className="flex-1">
                                <p className="font-medium text-[#5C4A3D]">{guest.name}</p>
                                <p className="text-xs text-[#A89080]">
                                    {guest.category} • {guest.phoneNumber || "No HP"}
                                </p>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs ${guest.rsvpStatus === "Coming"
                                        ? "bg-green-100 text-green-700"
                                        : guest.rsvpStatus === "Not Coming"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                            >
                                {guest.rsvpStatus}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
