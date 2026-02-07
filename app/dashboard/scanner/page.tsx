// QR Scanner Page
// Halaman untuk scan QR code tamu dan check-in

"use client";

import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

/**
 * Interface untuk data Guest dari scan
 */
interface ScannedGuest {
    id: number;
    name: string;
    category: string;
    rsvpStatus: string;
    guestCount: number;
    checkInTime: string | null;
}

/**
 * ScannerPage Component
 * Halaman QR Scanner untuk check-in tamu
 */
export default function ScannerPage() {
    const [isScanning, setIsScanning] = useState(false);
    const [scannedGuest, setScannedGuest] = useState<ScannedGuest | null>(null);
    const [manualCode, setManualCode] = useState("");
    const [message, setMessage] = useState<{
        type: "success" | "error" | "info";
        text: string;
    } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);

    /**
     * Start QR Scanner
     */
    async function startScanner() {
        // Set scanning state first so element is visible
        setIsScanning(true);
        setMessage({ type: "info", text: "Mengaktifkan kamera..." });

        // Small delay to ensure DOM element is visible
        await new Promise(resolve => setTimeout(resolve, 200));

        try {
            // Get element dimensions for dynamic qrbox
            const readerElement = document.getElementById("qr-reader");
            const width = readerElement?.clientWidth || 300;
            const qrboxSize = Math.min(width * 0.7, 200);

            const scanner = new Html5Qrcode("qr-reader", { verbose: false });
            scannerRef.current = scanner;

            // Configuration untuk scanning yang lebih baik
            const config = {
                fps: 15,
                qrbox: { width: qrboxSize, height: qrboxSize },
                aspectRatio: 1.0,
            };

            await scanner.start(
                { facingMode: "environment" },
                config,
                onScanSuccess,
                () => { } // Ignore scan failures
            );

            setMessage({ type: "success", text: "Kamera aktif. Arahkan ke QR Code." });
        } catch (error) {
            console.error("Error starting scanner:", error);
            setIsScanning(false);

            // More specific error messages
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            if (errorMessage.includes("NotAllowedError") || errorMessage.includes("Permission")) {
                setMessage({
                    type: "error",
                    text: "Izin kamera ditolak. Silakan izinkan akses kamera di browser.",
                });
            } else if (errorMessage.includes("NotFoundError")) {
                setMessage({
                    type: "error",
                    text: "Kamera tidak ditemukan. Pastikan perangkat memiliki kamera.",
                });
            } else {
                setMessage({
                    type: "error",
                    text: "Gagal mengakses kamera: " + errorMessage,
                });
            }
        }
    }

    /**
     * Stop QR Scanner
     */
    async function stopScanner() {
        if (scannerRef.current) {
            try {
                const scanner = scannerRef.current;
                scannerRef.current = null; // Clear ref first to prevent double stop
                await scanner.stop();
                await scanner.clear(); // Clear the scanner element
            } catch (error) {
                console.error("Error stopping scanner:", error);
            } finally {
                setIsScanning(false);
                setMessage(null);
            }
        } else {
            setIsScanning(false);
        }
    }

    /**
     * Handle successful QR scan
     */
    async function onScanSuccess(qrCodeString: string) {
        await stopScanner();
        await validateQRCode(qrCodeString);
    }

    /**
     * Validate QR code dan fetch data tamu
     */
    async function validateQRCode(qrCode: string) {
        setIsProcessing(true);
        setMessage({ type: "info", text: "Memvalidasi QR code..." });

        try {
            const response = await fetch("/api/check-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ qrCodeString: qrCode, action: "validate" }),
            });

            const data = await response.json();

            if (response.ok) {
                setScannedGuest(data.guest);
                if (data.guest.checkInTime) {
                    setMessage({
                        type: "info",
                        text: "Tamu sudah pernah check-in sebelumnya.",
                    });
                } else {
                    setMessage({ type: "success", text: "QR code valid!" });
                }
            } else {
                setMessage({ type: "error", text: data.error || "QR code tidak valid" });
            }
        } catch (error) {
            console.error("Error validating QR:", error);
            setMessage({ type: "error", text: "Gagal memvalidasi QR code" });
        } finally {
            setIsProcessing(false);
        }
    }

    /**
     * Handle manual code input
     */
    function handleManualSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (manualCode.trim()) {
            validateQRCode(manualCode.trim());
        }
    }

    /**
     * Confirm check-in
     */
    async function confirmCheckIn() {
        if (!scannedGuest) return;

        setIsProcessing(true);

        try {
            const response = await fetch("/api/check-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    guestId: scannedGuest.id,
                    action: "checkin",
                }),
            });

            if (response.ok) {
                setMessage({ type: "success", text: "Check-in berhasil!" });
                setScannedGuest((prev) =>
                    prev ? { ...prev, checkInTime: new Date().toISOString() } : null
                );
            } else {
                setMessage({ type: "error", text: "Gagal melakukan check-in" });
            }
        } catch (error) {
            console.error("Error checking in:", error);
            setMessage({ type: "error", text: "Terjadi kesalahan" });
        } finally {
            setIsProcessing(false);
        }
    }

    /**
     * Reset scanner state
     */
    function resetScanner() {
        setScannedGuest(null);
        setManualCode("");
        setMessage(null);
    }

    /**
     * Cleanup scanner on unmount
     */
    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                const scanner = scannerRef.current;
                scannerRef.current = null;
                scanner.stop().then(() => scanner.clear()).catch(() => { });
            }
        };
    }, []);

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-[#5C4A3D]">QR Scanner</h1>
                <p className="text-[#A89080] mt-1">
                    Scan QR code tamu untuk check-in
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Scanner Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#5C4A3D] mb-4">
                        Scan QR Code
                    </h2>

                    {/* QR Reader Container */}
                    <div
                        id="qr-reader"
                        className="w-full rounded-lg overflow-hidden bg-gray-100 mb-4"
                        style={{
                            minHeight: isScanning ? "300px" : "0px",
                            display: isScanning ? "block" : "none"
                        }}
                    />

                    {/* Placeholder when not scanning */}
                    {!isScanning && (
                        <div className="w-full aspect-square rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                            <div className="text-center text-[#A89080]">
                                <svg
                                    className="w-16 h-16 mx-auto mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                                    />
                                </svg>
                                <p>Klik tombol untuk mulai scan</p>
                            </div>
                        </div>
                    )}

                    {/* Scanner Controls */}
                    <div className="flex gap-3">
                        {!isScanning ? (
                            <button
                                onClick={startScanner}
                                className="flex-1 py-3 bg-[#E91E8C] text-white rounded-lg hover:bg-[#D91A7C] transition-colors flex items-center justify-center gap-2"
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
                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                Mulai Scan
                            </button>
                        ) : (
                            <button
                                onClick={stopScanner}
                                className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Stop Scan
                            </button>
                        )}
                    </div>

                    {/* Manual Input */}
                    <div className="mt-6 pt-6 border-t border-[#F0E6E0]">
                        <h3 className="text-sm font-medium text-[#5C4A3D] mb-3">
                            Input Manual QR Code
                        </h3>
                        <form onSubmit={handleManualSubmit} className="flex gap-3">
                            <input
                                type="text"
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value)}
                                placeholder="Masukkan kode QR..."
                                className="flex-1 px-4 py-2 border border-[#E5D5C5] rounded-lg focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                            />
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="px-4 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#7A6347] transition-colors disabled:opacity-50"
                            >
                                Cari
                            </button>
                        </form>
                    </div>
                </div>

                {/* Result Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#5C4A3D] mb-4">
                        Hasil Scan
                    </h2>

                    {/* Message */}
                    {message && (
                        <div
                            className={`mb-4 p-3 rounded-lg ${message.type === "success"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : message.type === "error"
                                    ? "bg-red-50 text-red-700 border border-red-200"
                                    : "bg-blue-50 text-blue-700 border border-blue-200"
                                }`}
                        >
                            {message.text}
                        </div>
                    )}

                    {/* Guest Info */}
                    {scannedGuest ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-[#F5E6E0] rounded-lg">
                                <h3 className="text-xl font-semibold text-[#5C4A3D]">
                                    {scannedGuest.name}
                                </h3>
                                <div className="mt-2 flex gap-2">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${scannedGuest.category === "VIP"
                                            ? "bg-[#E91E8C] text-white"
                                            : "bg-white text-[#5C4A3D]"
                                            }`}
                                    >
                                        {scannedGuest.category}
                                    </span>
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-white text-[#5C4A3D]">
                                        {scannedGuest.guestCount} orang
                                    </span>
                                </div>
                            </div>

                            {/* Check-in Status */}
                            {scannedGuest.checkInTime ? (
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <p className="text-green-700 font-medium">
                                        ✓ Sudah Check-in
                                    </p>
                                    <p className="text-sm text-green-600 mt-1">
                                        {new Date(scannedGuest.checkInTime).toLocaleString("id-ID")}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Confirm Button */}
                                    <button
                                        onClick={confirmCheckIn}
                                        disabled={isProcessing}
                                        className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        Konfirmasi Check-in
                                    </button>
                                </div>
                            )}

                            {/* Reset Button */}
                            <button
                                onClick={resetScanner}
                                className="w-full py-2 border border-[#E5D5C5] text-[#5C4A3D] rounded-lg hover:bg-[#F5E6E0] transition-colors"
                            >
                                Scan Tamu Lain
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-[#A89080]">
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
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                            <p>Scan QR code tamu untuk melihat informasi</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
