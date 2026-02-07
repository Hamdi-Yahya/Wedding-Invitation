// Invitation Card Component untuk Download
// Komponen undangan yang bisa di-generate sebagai gambar/PDF

import React, { forwardRef } from "react";

/**
 * Props untuk InvitationCard
 */
interface InvitationCardProps {
    guestName: string;
    partner1Name: string;
    partner2Name: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    venueName: string;
    venueAddress: string;
    primaryColor: string;
    category: string;
    qrCodeString?: string;
}

/**
 * Format tanggal ke format Indonesia
 */
function formatDateIndonesia(date: Date | string): string {
    const d = new Date(date);
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Format waktu ke format 12 jam
 */
function formatTime(time: string): string {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
}

/**
 * InvitationCard Component
 * Kartu undangan yang siap di-download
 */
const InvitationCard = forwardRef<HTMLDivElement, InvitationCardProps>(
    function InvitationCard(
        {
            guestName,
            partner1Name,
            partner2Name,
            eventDate,
            startTime,
            endTime,
            venueName,
            venueAddress,
            primaryColor,
            category,
            qrCodeString,
        },
        ref
    ) {
        const formattedDate = formatDateIndonesia(eventDate);
        const startFormatted = formatTime(startTime);
        const endFormatted = formatTime(endTime);

        return (
            <div
                ref={ref}
                style={{
                    width: "400px",
                    minHeight: "560px",
                    backgroundColor: "#FFFAF5",
                    fontFamily: "'Playfair Display', serif",
                    position: "relative",
                    padding: "20px",
                    boxSizing: "border-box",
                }}
            >
                {/* Border Frame */}
                <div
                    style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        right: "10px",
                        bottom: "10px",
                        border: `2px solid ${primaryColor}20`,
                        pointerEvents: "none",
                    }}
                />

                {/* Content Container */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        padding: "30px 20px",
                        textAlign: "center",
                    }}
                >
                    {/* Guest Badge */}
                    <div
                        style={{
                            backgroundColor: primaryColor,
                            color: "white",
                            padding: "8px 24px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "600",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            marginBottom: "24px",
                        }}
                    >
                        {category === "VIP" ? "VIP Guest" : "Special Guest"}: {guestName}
                    </div>

                    {/* Flower Icon */}
                    <div style={{ color: primaryColor, marginBottom: "16px" }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C10.9 2 10 2.9 10 4C10 5.1 10.9 6 12 6C13.1 6 14 5.1 14 4C14 2.9 13.1 2 12 2ZM6 6C4.9 6 4 6.9 4 8C4 9.1 4.9 10 6 10C7.1 10 8 9.1 8 8C8 6.9 7.1 6 6 6ZM18 6C16.9 6 16 6.9 16 8C16 9.1 16.9 10 18 10C19.1 10 20 9.1 20 8C20 6.9 19.1 6 18 6ZM12 8C9.8 8 8 9.8 8 12C8 14.2 9.8 16 12 16C14.2 16 16 14.2 16 12C16 9.8 14.2 8 12 8ZM3 12C1.9 12 1 12.9 1 14C1 15.1 1.9 16 3 16C4.1 16 5 15.1 5 14C5 12.9 4.1 12 3 12ZM21 12C19.9 12 19 12.9 19 14C19 15.1 19.9 16 21 16C22.1 16 23 15.1 23 14C23 12.9 22.1 12 21 12ZM12 18C9.8 18 8 19.8 8 22H16C16 19.8 14.2 18 12 18Z" />
                        </svg>
                    </div>

                    {/* Together Text */}
                    <p
                        style={{
                            color: primaryColor,
                            fontSize: "11px",
                            letterSpacing: "3px",
                            textTransform: "uppercase",
                            marginBottom: "16px",
                            fontFamily: "sans-serif",
                        }}
                    >
                        Together With Their Families
                    </p>

                    {/* Couple Names */}
                    <h1
                        style={{
                            fontSize: "42px",
                            fontWeight: "400",
                            color: "#2D2D2D",
                            margin: "0 0 4px 0",
                            lineHeight: "1.2",
                        }}
                    >
                        {partner1Name}
                    </h1>
                    <p
                        style={{
                            fontSize: "28px",
                            color: "#999",
                            margin: "0 0 4px 0",
                            fontStyle: "italic",
                        }}
                    >
                        &
                    </p>
                    <h1
                        style={{
                            fontSize: "42px",
                            fontWeight: "400",
                            color: "#2D2D2D",
                            margin: "0 0 20px 0",
                            lineHeight: "1.2",
                        }}
                    >
                        {partner2Name}
                    </h1>

                    {/* Invitation Text */}
                    <p
                        style={{
                            fontSize: "13px",
                            color: "#666",
                            marginBottom: "24px",
                            lineHeight: "1.6",
                            fontFamily: "sans-serif",
                        }}
                    >
                        Joyfully invite you to share in their
                        <br />
                        happiness as they unite in marriage
                    </p>

                    {/* Date */}
                    <h2
                        style={{
                            fontSize: "18px",
                            fontWeight: "700",
                            color: "#2D2D2D",
                            margin: "0 0 4px 0",
                        }}
                    >
                        {formattedDate}
                    </h2>

                    {/* Time Icons */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "40px",
                            margin: "20px 0",
                            borderTop: "1px solid #eee",
                            borderBottom: "1px solid #eee",
                            padding: "16px 0",
                            width: "100%",
                        }}
                    >
                        <div style={{ textAlign: "center" }}>
                            <div style={{ color: primaryColor, marginBottom: "6px" }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                </svg>
                            </div>
                            <p style={{ fontSize: "14px", fontWeight: "700", color: "#2D2D2D", margin: "0" }}>
                                {startFormatted}
                            </p>
                            <p style={{ fontSize: "11px", color: "#999", margin: "4px 0 0 0", fontFamily: "sans-serif" }}>
                                Ceremony
                            </p>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ color: primaryColor, marginBottom: "6px" }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                                </svg>
                            </div>
                            <p style={{ fontSize: "14px", fontWeight: "700", color: "#2D2D2D", margin: "0" }}>
                                {endFormatted}
                            </p>
                            <p style={{ fontSize: "11px", color: "#999", margin: "4px 0 0 0", fontFamily: "sans-serif" }}>
                                Reception
                            </p>
                        </div>
                    </div>

                    {/* Venue */}
                    <div style={{ color: primaryColor, marginBottom: "8px" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                    </div>
                    <h3
                        style={{
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "#2D2D2D",
                            margin: "0 0 4px 0",
                        }}
                    >
                        {venueName}
                    </h3>
                    <p
                        style={{
                            fontSize: "12px",
                            color: "#666",
                            margin: "0",
                            fontFamily: "sans-serif",
                            maxWidth: "280px",
                        }}
                    >
                        {venueAddress}
                    </p>

                    {/* QR Code Section */}
                    {qrCodeString && (
                        <div
                            style={{
                                marginTop: "20px",
                                paddingTop: "16px",
                                borderTop: "1px solid #eee",
                                textAlign: "center",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "10px",
                                    color: "#999",
                                    marginBottom: "8px",
                                    fontFamily: "sans-serif",
                                    letterSpacing: "1px",
                                    textTransform: "uppercase",
                                }}
                            >
                                Scan QR untuk Check-in
                            </p>
                            <div
                                style={{
                                    backgroundColor: "white",
                                    padding: "8px",
                                    borderRadius: "8px",
                                    display: "inline-block",
                                    border: `1px solid ${primaryColor}20`,
                                }}
                            >
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrCodeString)}`}
                                    alt="QR Code"
                                    style={{ width: "80px", height: "80px" }}
                                />
                            </div>
                            <p
                                style={{
                                    fontSize: "12px",
                                    color: primaryColor,
                                    marginTop: "6px",
                                    fontWeight: "600",
                                    fontFamily: "monospace",
                                }}
                            >
                                {qrCodeString}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

export default InvitationCard;
