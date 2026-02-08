"use client";

import { useState, useEffect } from "react";

interface QRCodeDisplayProps {
    qrCodeString: string;
    guestName: string;
    primaryColor: string;
    secondaryColor: string;
}

export default function QRCodeDisplay({
    qrCodeString,
    guestName,
    primaryColor,
}: QRCodeDisplayProps) {
    const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

    useEffect(() => {
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
            qrCodeString
        )}&bgcolor=FFFFFF&color=000000`;
        setQrCodeUrl(url);
    }, [qrCodeString]);

    return (
        <section className="py-16 px-6">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-10">
                    <p
                        className="text-sm uppercase tracking-widest mb-2"
                        style={{ color: primaryColor }}
                    >
                        Tiket Masuk
                    </p>
                    <h2 className="text-3xl font-serif" style={{ color: primaryColor }}>
                        QR Code Anda
                    </h2>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                    <div className="mb-6">
                        {qrCodeUrl ? (
                            <img
                                src={qrCodeUrl}
                                alt="QR Code"
                                className="w-48 h-48 mx-auto rounded-lg"
                            />
                        ) : (
                            <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg animate-pulse" />
                        )}
                    </div>

                    <h3
                        className="text-xl font-semibold mb-2"
                        style={{ color: primaryColor }}
                    >
                        {guestName}
                    </h3>

                    <p className="text-gray-500 text-sm mb-6">
                        Tunjukkan QR code ini saat registrasi di venue
                    </p>

                    <a
                        href={qrCodeUrl}
                        download={`qr-code-${guestName.toLowerCase().replace(/\s+/g, "-")}.png`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-medium transition-all hover:opacity-90"
                        style={{ backgroundColor: primaryColor }}
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
                        Download QR Code
                    </a>
                </div>

                <p className="text-center text-sm text-gray-400 mt-4">
                    Simpan atau screenshot QR code ini
                </p>
            </div>
        </section>
    );
}
