// Details Section Component
// Section detail acara dengan 3 kartu (Ceremony, Reception, Dress Code)

/**
 * Interface untuk Wedding Details dari database
 */
interface WeddingDetailsData {
    ceremonyTitle: string;
    ceremonyTime: string | null;
    ceremonyVenue: string | null;
    ceremonyAddress: string | null;
    receptionTitle: string;
    receptionTime: string | null;
    receptionVenue: string | null;
    receptionNote: string | null;
    dressCodeTitle: string;
    dressCodeNote: string | null;
    dressCodeStyle1: string | null;
    dressCodeStyle2: string | null;
}

/**
 * Props untuk DetailsSection
 */
interface DetailsSectionProps {
    date: string;
    time: string;
    venueName: string;
    venueAddress: string;
    primaryColor: string;
    secondaryColor: string;
    weddingDetails?: WeddingDetailsData | null;
}

/**
 * DetailsSection Component
 * Menampilkan 3 kartu detail: Ceremony, Reception, Dress Code
 */
export default function DetailsSection({
    date,
    time,
    venueName,
    venueAddress,
    primaryColor,
    secondaryColor,
    weddingDetails,
}: DetailsSectionProps) {
    // Parse venue address untuk pemisahan
    const addressParts = venueAddress.split(",");
    const shortAddress = addressParts.length > 1
        ? addressParts.slice(0, 2).join(",").trim()
        : venueAddress;

    // Event details cards data - gunakan data dari database jika ada
    const eventCards = [
        {
            title: weddingDetails?.ceremonyTitle || "The Ceremony",
            time: weddingDetails?.ceremonyTime || time.split(" - ")[0] || time,
            details: weddingDetails?.ceremonyVenue || weddingDetails?.ceremonyAddress
                ? [
                    weddingDetails.ceremonyVenue || venueName,
                    weddingDetails.ceremonyAddress || shortAddress
                ].filter(Boolean)
                : [venueName, shortAddress],
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
            ),
        },
        {
            title: weddingDetails?.receptionTitle || "The Reception",
            time: weddingDetails?.receptionTime || time,
            details: [
                weddingDetails?.receptionVenue || venueName,
                weddingDetails?.receptionNote || "Party starts..."
            ].filter(Boolean),
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
            ),
        },
        {
            title: weddingDetails?.dressCodeTitle || "Dress Code",
            time: weddingDetails?.dressCodeNote || "We'd Love...",
            details: [
                weddingDetails?.dressCodeStyle1 || "Formal Attire",
                weddingDetails?.dressCodeStyle2 || "Smart Casual"
            ].filter(Boolean),
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
            ),
        },
    ];

    return (
        <section id="details" className="py-20 px-6 bg-white">
            <div className="max-w-5xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <p
                        className="text-sm mb-2"
                        style={{ fontFamily: "'Parisienne', cursive", color: primaryColor }}
                    >
                        When & Where
                    </p>
                    <h2 className="text-3xl font-bold text-gray-800">Wedding Details</h2>
                </div>

                {/* Event Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {eventCards.map((card) => (
                        <div
                            key={card.title}
                            className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
                        >
                            {/* Icon */}
                            <div
                                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                            >
                                {card.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {card.title}
                            </h3>

                            {/* Time */}
                            <p style={{ color: primaryColor }} className="text-sm font-medium mb-3">
                                {card.time}
                            </p>

                            {/* Details */}
                            <div className="text-gray-500 text-sm">
                                {card.details.map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
