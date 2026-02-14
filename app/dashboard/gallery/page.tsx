
"use client";

import { useState, useEffect, useRef } from "react";

interface GalleryImage {
    id: number;
    imageUrl: string;
    altText: string | null;
    sortOrder: number;
    isActive: boolean;
}

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [altText, setAltText] = useState("");
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchImages();
    }, []);

    async function fetchImages() {
        try {
            const response = await fetch("/api/gallery");
            if (response.ok) {
                const data = await response.json();
                setImages(data);
            }
        } catch (error) {
            console.error("Error fetching gallery:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            alert("Tipe file tidak didukung. Gunakan JPEG, PNG, WebP, atau GIF.");
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert("Ukuran file terlalu besar. Maksimal 5MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setUploadedImageUrl(data.imageUrl);
            } else {
                const error = await response.json();
                alert(error.error || "Gagal mengupload file");
                setPreviewUrl("");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Gagal mengupload file");
            setPreviewUrl("");
        } finally {
            setIsUploading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const imageUrl = editingImage ? editingImage.imageUrl : uploadedImageUrl;

        if (!imageUrl) {
            alert("Silakan pilih gambar terlebih dahulu");
            return;
        }

        try {
            if (editingImage) {
                const response = await fetch(`/api/gallery/${editingImage.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        imageUrl: editingImage.imageUrl,
                        altText
                    }),
                });

                if (response.ok) {
                    const updated = await response.json();
                    setImages((prev) =>
                        prev.map((img) => (img.id === updated.id ? updated : img))
                    );
                }
            } else {
                const response = await fetch("/api/gallery", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ imageUrl: uploadedImageUrl, altText }),
                });

                if (response.ok) {
                    const newImage = await response.json();
                    setImages((prev) => [...prev, newImage]);
                }
            }

            closeModal();
        } catch (error) {
            console.error("Error saving image:", error);
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Apakah Anda yakin ingin menghapus gambar ini?")) return;

        try {
            const response = await fetch(`/api/gallery/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setImages((prev) => prev.filter((img) => img.id !== id));
            }
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    }

    function openAddModal() {
        setEditingImage(null);
        setPreviewUrl("");
        setUploadedImageUrl("");
        setAltText("");
        setShowModal(true);
    }

    function openEditModal(image: GalleryImage) {
        setEditingImage(image);
        setPreviewUrl(image.imageUrl);
        setUploadedImageUrl(image.imageUrl);
        setAltText(image.altText || "");
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        setEditingImage(null);
        setPreviewUrl("");
        setUploadedImageUrl("");
        setAltText("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E91E8C] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-[#5C4A3D]">Galeri</h1>
                    <p className="text-[#A89080] mt-1">Kelola foto-foto pernikahan</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="px-4 py-2 bg-[#E91E8C] text-white rounded-lg font-medium hover:bg-[#D91A7C] transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Foto
                </button>
            </div>

            <div className="bg-white rounded-xl p-4 mb-6">
                <p className="text-[#5C4A3D]">
                    Total: <span className="font-bold">{images.length}</span> foto
                </p>
            </div>

            {images.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center text-[#A89080]">
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
                    <p>Belum ada foto. Klik tombol &quot;Tambah Foto&quot; untuk menambahkan.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className="bg-white rounded-xl overflow-hidden shadow-sm group relative"
                        >
                            <div className="aspect-square">
                                <img
                                    src={image.imageUrl}
                                    alt={image.altText || "Gallery image"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => openEditModal(image)}
                                    className="p-2 bg-white rounded-lg text-[#5C4A3D] hover:bg-gray-100 transition-colors"
                                    title="Edit"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(image.id)}
                                    className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
                                    title="Hapus"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                            {image.altText && (
                                <div className="p-2 text-xs text-[#A89080] truncate">
                                    {image.altText}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-semibold text-[#5C4A3D] mb-4">
                            {editingImage ? "Edit Foto" : "Tambah Foto"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!editingImage && (
                                <div>
                                    <label className="block text-sm font-medium text-[#5C4A3D] mb-2">
                                        Upload Gambar <span className="text-red-500">*</span>
                                    </label>
                                    <div
                                        className="border-2 border-dashed border-[#E5D5C5] rounded-lg p-6 text-center cursor-pointer hover:border-[#E91E8C] transition-colors"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {isUploading ? (
                                            <div className="flex flex-col items-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#E91E8C] border-t-transparent mb-2"></div>
                                                <p className="text-sm text-[#A89080]">Mengupload...</p>
                                            </div>
                                        ) : previewUrl ? (
                                            <div>
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="max-h-40 mx-auto rounded-lg mb-2"
                                                />
                                                <p className="text-xs text-[#A89080]">Klik untuk ganti gambar</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <svg className="w-12 h-12 mx-auto text-[#E91E8C] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-sm text-[#A89080]">Klik untuk memilih gambar</p>
                                                <p className="text-xs text-[#C5B5A5] mt-1">JPEG, PNG, WebP, GIF (Maks. 5MB)</p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </div>
                            )}

                            {editingImage && (
                                <div className="border border-[#E5D5C5] rounded-lg p-2">
                                    <p className="text-xs text-[#A89080] mb-2">Gambar saat ini:</p>
                                    <img
                                        src={editingImage.imageUrl}
                                        alt="Current"
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-[#5C4A3D] mb-2">
                                    Deskripsi Gambar
                                </label>
                                <input
                                    type="text"
                                    value={altText}
                                    onChange={(e) => setAltText(e.target.value)}
                                    placeholder="Contoh: Foto prewedding di pantai"
                                    className="w-full px-4 py-3 border border-[#E5D5C5] rounded-lg focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-3 border border-[#E5D5C5] text-[#5C4A3D] rounded-lg font-medium hover:bg-[#F5E6E0] transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUploading || (!editingImage && !uploadedImageUrl)}
                                    className="flex-1 px-4 py-3 bg-[#E91E8C] text-white rounded-lg font-medium hover:bg-[#D91A7C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {editingImage ? "Simpan" : "Tambah"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
