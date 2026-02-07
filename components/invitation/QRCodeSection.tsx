// QR Code Display Component for Invitation
// Menampilkan QR Code unik tamu untuk check-in

"use client";

import { QRCodeSVG } from "qrcode.react";

/**
 * Props untuk QRCodeSection
 */
interface QRCodeSectionProps {
    qrCodeString: string;
    guestName: string;
    primaryColor: string;
    secondaryColor: string;
}

/**
 * QRCodeSection Component
 * Menampilkan QR Code unik untuk check-in tamu
 */
export default function QRCodeSection({
    qrCodeString,
    guestName,
    primaryColor,
    secondaryColor,
}: QRCodeSectionProps) {
    return (
        <section id="qrcode" className="py-16 px-6 bg-white">
            <div className="max-w-md mx-auto text-center">
                {/* Section Title */}
                <div className="mb-8">
                    <p
                        className="text-sm mb-2"
                        style={{ fontFamily: "'Parisienne', cursive", color: primaryColor }}
                    >
                        Your Invitation
                    </p>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        QR Code Check-in
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Tunjukkan QR Code ini saat registrasi di hari H
                    </p>
                </div>

                {/* QR Code Card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm inline-block">
                    {/* QR Code */}
                    <div className="flex justify-center mb-4">
                        <QRCodeSVG
                            value={qrCodeString}
                            size={200}
                            level="H"
                            includeMargin={true}
                            fgColor="#2D2D2D"
                            bgColor="#FFFFFF"
                        />
                    </div>

                    {/* Instructions */}
                    <p className="text-xs text-gray-400 mt-4">
                        Screenshot atau simpan QR Code ini
                    </p>
                </div>
            </div>
        </section>
    );
}
