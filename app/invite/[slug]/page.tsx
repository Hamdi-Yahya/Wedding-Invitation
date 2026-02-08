// Halaman Undangan Personalized
// Menampilkan undangan berdasarkan slug tamu

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import HeroSection from "@/components/invitation/HeroSection";
import DetailsSection from "@/components/invitation/DetailsSection";
import MapSection from "@/components/invitation/MapSection";
import GallerySection from "@/components/invitation/GallerySection";
import RSVPForm from "@/components/invitation/RSVPForm";
import WishesSection from "@/components/invitation/WishesSection";
import QRCodeSection from "@/components/invitation/QRCodeSection";

/**
 * Format tanggal ke bahasa Indonesia
 */
function formatDateIndonesia(date: Date | string): string {
    const d = new Date(date);
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Format waktu ke format Indonesia
 */
function formatTimeIndonesia(time: string): string {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes} WIB`;
}

/**
 * Props untuk halaman invite
 */
interface InvitePageProps {
    params: Promise<{ slug: string }>;
}

/**
 * Halaman undangan dengan nama tamu yang dipersonalisasi
 */
export default async function InvitePage({ params }: InvitePageProps) {
    const { slug } = await params;

    // Fetch guest berdasarkan slug
    const guest = await prisma.guest.findUnique({
        where: { slug },
    });

    // Jika tamu tidak ditemukan, tampilkan 404
    if (!guest) {
        notFound();
    }

    // Fetch event settings
    const eventSettings = await prisma.eventSettings.findFirst({
        where: { id: 1 },
    });

    // Fetch theme settings
    const themeSettings = await prisma.themeSettings.findFirst({
        where: { id: 1 },
    });

    // Fetch approved wishes dengan relasi guest
    const wishes = await prisma.wish.findMany({
        where: { isApproved: true },
        include: { guest: true },
        orderBy: { createdAt: "desc" },
        take: 20,
    });

    // Fetch gallery images
    let galleryImages: { id: number; imageUrl: string; altText: string | null }[] = [];
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const galleryData = await (prisma as any).galleryImage.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
        });
        galleryImages = galleryData.map((img: { id: number; imageUrl: string; altText: string | null }) => ({
            id: img.id,
            imageUrl: img.imageUrl,
            altText: img.altText,
        }));
    } catch {
        galleryImages = [];
    }

    // Fetch wedding details
    let weddingDetails = null;
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        weddingDetails = await (prisma as any).weddingDetails.findFirst({
            where: { id: 1 },
        });
    } catch {
        weddingDetails = null;
    }

    if (!eventSettings || !themeSettings) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Undangan belum dikonfigurasi</p>
            </div>
        );
    }

    // Format tanggal dan waktu
    const formattedDate = formatDateIndonesia(eventSettings.eventDate);
    const formattedTime = `${formatTimeIndonesia(eventSettings.startTime)} - ${formatTimeIndonesia(eventSettings.endTime)}`;

    // Gunakan warna dari theme settings
    const primaryColor = themeSettings.primaryColor || "#E91E8C";
    const secondaryColor = themeSettings.secondaryColor || "#FFF9F9";

    // Map font family ke CSS variable
    const fontFamilyMap: { [key: string]: string } = {
        "Playfair Display": "var(--font-playfair)",
        "Great Vibes": "var(--font-great-vibes)",
        "Cormorant Garamond": "var(--font-cormorant)",
        "Lora": "var(--font-lora)",
        "Merriweather": "var(--font-merriweather)",
        "Crimson Text": "var(--font-crimson)",
        "Libre Baskerville": "var(--font-libre)",
    };
    const fontFamily = fontFamilyMap[themeSettings.fontFamily] || "var(--font-playfair)";

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily }}>
            {/* Hero Section dengan nama tamu */}
            <HeroSection
                guestName={guest.name}
                partner1Name={eventSettings.partner1Name}
                partner2Name={eventSettings.partner2Name}
                tagline={eventSettings.tagline || ""}
                eventDate={eventSettings.eventDate}
                primaryColor={primaryColor}
                secondaryColor={themeSettings.secondaryColor}
                backgroundImageUrl={themeSettings.backgroundImageUrl || ""}
            />

            {/* Wedding Details */}
            <DetailsSection
                date={formattedDate}
                time={formattedTime}
                venueName={eventSettings.venueName}
                venueAddress={eventSettings.venueAddress}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                weddingDetails={weddingDetails}
            />

            {/* Map Section */}
            {eventSettings.mapLinkUrl && (
                <MapSection
                    mapLinkUrl={eventSettings.mapLinkUrl}
                    venueName={eventSettings.venueName}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                />
            )}

            {/* Gallery Section */}
            <GallerySection
                primaryColor={primaryColor}
                secondaryColor="#FFFFFF"
                images={galleryImages}
            />

            {/* RSVP Form */}
            <RSVPForm
                primaryColor={primaryColor}
                secondaryColor={themeSettings.secondaryColor}
                guestSlug={slug}
                guestName={guest.name}
                guestPhone={guest.phoneNumber || ""}
            />

            {/* QR Code Section */}
            <QRCodeSection
                qrCodeString={guest.qrCodeString}
                guestName={guest.name}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
            />

            {/* Wishes Section */}
            <WishesSection
                wishes={wishes.map((w: { id: number; guest: { name: string }; message: string; createdAt: Date }) => ({
                    id: w.id,
                    guestName: w.guest.name,
                    message: w.message,
                    createdAt: w.createdAt.toISOString(),
                }))}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
            />

            {/* Footer */}
            <footer className="py-12 text-center bg-[#FFF9F9]">
                <p
                    className="text-3xl mb-2"
                    style={{ fontFamily: "'Parisienne', cursive", color: primaryColor }}
                >
                    {eventSettings.partner1Name} & {eventSettings.partner2Name}
                </p>
                <p className="text-gray-500 text-sm">
                    © 2024 Wedding Invitation Website
                </p>
            </footer>
        </div>
    );
}
