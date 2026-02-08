interface GalleryImage {
    id: number;
    imageUrl: string;
    altText: string | null;
}

interface GallerySectionProps {
    primaryColor: string;
    secondaryColor: string;
    images: GalleryImage[];
}

export default function GallerySection({ primaryColor, secondaryColor, images }: GallerySectionProps) {
    if (images.length === 0) {
        return (
            <section id="gallery" className="py-20 px-6" style={{ backgroundColor: secondaryColor }}>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <p
                            className="text-sm mb-2"
                            style={{ fontFamily: "'Parisienne', cursive", color: primaryColor }}
                        >
                            Sweet Memories
                        </p>
                        <h2 className="text-3xl font-bold text-gray-800">Photo Gallery</h2>
                    </div>

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
                <div className="text-center mb-12">
                    <p
                        className="text-sm mb-2"
                        style={{ fontFamily: "'Parisienne', cursive", color: primaryColor }}
                    >
                        Sweet Memories
                    </p>
                    <h2 className="text-3xl font-bold text-gray-800">Photo Gallery</h2>
                </div>

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
