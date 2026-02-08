interface MapSectionProps {
    mapLinkUrl: string;
    venueName: string;
    primaryColor: string;
    secondaryColor: string;
}

function getEmbedUrl(mapLink: string): string {
    if (mapLink.includes("embed")) {
        return mapLink;
    }

    if (mapLink.includes("maps.google.com") || mapLink.includes("goo.gl")) {
        const placeQuery = encodeURIComponent(mapLink);
        return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${placeQuery}`;
    }

    return `https://www.google.com/maps?q=${encodeURIComponent(mapLink)}&output=embed`;
}

export default function MapSection({
    mapLinkUrl,
    venueName,
    primaryColor,
    secondaryColor,
}: MapSectionProps) {
    return (
        <section className="py-16 px-6" style={{ backgroundColor: secondaryColor }}>
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <p
                        className="text-sm uppercase tracking-widest mb-2"
                        style={{ color: primaryColor }}
                    >
                        Lokasi Acara
                    </p>
                    <h2 className="text-3xl font-serif" style={{ color: primaryColor }}>
                        Peta Lokasi
                    </h2>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm">
                    <div className="aspect-video">
                        <iframe
                            src={getEmbedUrl(mapLinkUrl)}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`Peta lokasi ${venueName}`}
                        />
                    </div>
                    <div className="p-4 text-center">
                        <a
                            href={mapLinkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-white text-sm transition-all hover:opacity-90"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                            Buka di Google Maps
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
