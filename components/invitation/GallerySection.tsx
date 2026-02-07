// Gallery Section Component
// Section galeri foto dengan layout grid responsive - data dari database

/**
 * Interface untuk data GalleryImage
 */
interface GalleryImage {
    id: number;
    imageUrl: string;
    altText: string | null;
}

/**
 * Props untuk GallerySection
 */
interface GallerySectionProps {
    primaryColor: string;
    secondaryColor: string;
    images: GalleryImage[];
}

/**
 * GallerySection Component
 * Menampilkan galeri foto dari database dengan layout grid responsive
 */
export default function GallerySection({ primaryColor, secondaryColor, images }: GallerySectionProps) {
    // Jika tidak ada foto, tampilkan placeholder
    if (images.length === 0) {
        return (
            <section id="gallery" className="py-20 px-6" style={{ backgroundColor: secondaryColor }}>
                <div className="max-w-5xl mx-auto">
                    {/* Section Title */}
                    <div className="text-center mb-12">
                        <p
                            className="text-sm mb-2"
                            style={{ fontFamily: "'Parisienne', cursive", color: primaryColor }}
                        >
                            Sweet Memories
                        </p>
                        <h2 className="text-3xl font-bold text-gray-800">Photo Gallery</h2>
                    </div>

                    {/* Empty State */}
                    <div className="text-center text-gray-400 py-12">
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
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p>Belum ada foto yang ditambahkan</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="gallery" className="py-20 px-6" style={{ backgroundColor: secondaryColor }}>
            <div className="max-w-5xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <p
                        className="text-sm mb-2"
                        style={{ fontFamily: "'Parisienne', cursive", color: primaryColor }}
                    >
                        Sweet Memories
                    </p>
                    <h2 className="text-3xl font-bold text-gray-800">Photo Gallery</h2>
                </div>

                {/* Gallery Grid - Masonry-like layout menggunakan CSS columns */}
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className="break-inside-avoid overflow-hidden rounded-2xl"
                        >
                            <img
                                src={image.imageUrl}
                                alt={image.altText || "Gallery photo"}
                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
