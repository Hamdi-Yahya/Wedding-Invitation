// Theme Settings Page
// Form untuk mengelola tema undangan dengan fitur upload background

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/**
 * Interface untuk data ThemeSettings
 */
interface ThemeSettings {
    id: number;
    themeName: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    backgroundImageUrl: string;
}

/**
 * Default background image URL
 */
const DEFAULT_BACKGROUND_URL = "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=1600";

/**
 * Preset font families yang tersedia
 */
const fontOptions = [
    "Playfair Display",
    "Great Vibes",
    "Cormorant Garamond",
    "Lora",
    "Merriweather",
    "Crimson Text",
    "Libre Baskerville",
];

/**
 * ThemeSettingsPage Component
 * Form untuk update tema undangan dengan upload background
 */
export default function ThemeSettingsPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [useCustomBackground, setUseCustomBackground] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [formData, setFormData] = useState<ThemeSettings>({
        id: 1,
        themeName: "Modern Pink",
        primaryColor: "#E91E8C",
        secondaryColor: "#F5E6E0",
        fontFamily: "Playfair Display",
        backgroundImageUrl: "",
    });

    /**
     * Fetch data ThemeSettings dari API
     */
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("/api/theme-settings");
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setFormData(data);
                        // Check if using custom background
                        if (data.backgroundImageUrl && data.backgroundImageUrl !== DEFAULT_BACKGROUND_URL) {
                            setUseCustomBackground(true);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching theme settings:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    /**
     * Handle perubahan input
     */
    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    /**
     * Handle upload file gambar background
     */
    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setMessage({ type: "error", text: "File harus berupa gambar (JPG, PNG, WebP)" });
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: "error", text: "Ukuran file maksimal 5MB" });
            return;
        }

        setIsUploading(true);
        setMessage(null);

        try {
            const uploadFormData = new FormData();
            uploadFormData.append("file", file);
            uploadFormData.append("type", "background");

            const response = await fetch("/api/upload", {
                method: "POST",
                body: uploadFormData,
            });

            if (response.ok) {
                const data = await response.json();
                setFormData((prev) => ({ ...prev, backgroundImageUrl: data.url }));
                setUseCustomBackground(true);
                setMessage({ type: "success", text: "Background berhasil diupload!" });
            } else {
                const error = await response.json();
                setMessage({ type: "error", text: error.error || "Gagal upload gambar" });
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setMessage({ type: "error", text: "Terjadi kesalahan saat upload" });
        } finally {
            setIsUploading(false);
        }
    }

    /**
     * Handle switch ke default background
     */
    function handleUseDefaultBackground() {
        setUseCustomBackground(false);
        setFormData((prev) => ({ ...prev, backgroundImageUrl: "" }));
    }

    /**
     * Handle submit form
     */
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            const response = await fetch("/api/theme-settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMessage({ type: "success", text: "Theme settings berhasil disimpan!" });
                router.refresh();
            } else {
                setMessage({ type: "error", text: "Gagal menyimpan theme settings" });
            }
        } catch (error) {
            console.error("Error saving theme settings:", error);
            setMessage({ type: "error", text: "Terjadi kesalahan. Silakan coba lagi." });
        } finally {
            setIsSaving(false);
        }
    }

    /**
     * Get current background URL for preview
     */
    function getCurrentBackgroundUrl(): string {
        if (useCustomBackground && formData.backgroundImageUrl) {
            return formData.backgroundImageUrl;
        }
        return DEFAULT_BACKGROUND_URL;
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
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-[#5C4A3D]">Theme Settings</h1>
                <p className="text-[#A89080] mt-1">Kustomisasi tampilan undangan Anda</p>
            </div>

            {/* Message */}
            {message && (
                <div
                    className={`mb-6 p-4 rounded-lg ${message.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Settings Card */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-[#5C4A3D] mb-4">Pengaturan Dasar</h2>

                        {/* Theme Name */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-[#5C4A3D] mb-2">
                                Nama Tema
                            </label>
                            <input
                                type="text"
                                name="themeName"
                                value={formData.themeName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-[#E5D5C5] rounded-lg focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                                placeholder="Contoh: Modern Pink"
                            />
                        </div>

                        {/* Colors */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-[#5C4A3D] mb-2">
                                    Warna Utama
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        name="primaryColor"
                                        value={formData.primaryColor}
                                        onChange={handleChange}
                                        className="w-10 h-10 rounded-lg border border-[#E5D5C5] cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        name="primaryColor"
                                        value={formData.primaryColor}
                                        onChange={handleChange}
                                        className="w-24 px-2 py-2 border border-[#E5D5C5] rounded-lg focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none font-mono text-xs"
                                        placeholder="#E91E8C"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#5C4A3D] mb-2">
                                    Warna Sekunder
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        name="secondaryColor"
                                        value={formData.secondaryColor}
                                        onChange={handleChange}
                                        className="w-10 h-10 rounded-lg border border-[#E5D5C5] cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        name="secondaryColor"
                                        value={formData.secondaryColor}
                                        onChange={handleChange}
                                        className="w-24 px-2 py-2 border border-[#E5D5C5] rounded-lg focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none font-mono text-xs"
                                        placeholder="#F5E6E0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Font Family */}
                        <div>
                            <label className="block text-sm font-medium text-[#5C4A3D] mb-2">
                                Font Family
                            </label>
                            <select
                                name="fontFamily"
                                value={formData.fontFamily}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-[#E5D5C5] rounded-lg focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none bg-white"
                            >
                                {fontOptions.map((font) => (
                                    <option key={font} value={font}>
                                        {font}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Background Image Card */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-[#5C4A3D] mb-4">Background Hero</h2>

                        {/* Background Type Selection */}
                        <div className="space-y-3 mb-6">
                            <label className="flex items-center gap-3 p-3 border border-[#E5D5C5] rounded-lg cursor-pointer hover:bg-[#FAF7F5] transition-colors">
                                <input
                                    type="radio"
                                    name="backgroundType"
                                    checked={!useCustomBackground}
                                    onChange={handleUseDefaultBackground}
                                    className="w-4 h-4 text-[#E91E8C] focus:ring-[#E91E8C]"
                                />
                                <div>
                                    <p className="font-medium text-[#5C4A3D]">Background Default</p>
                                    <p className="text-sm text-[#A89080]">Gunakan gambar bawaan</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 border border-[#E5D5C5] rounded-lg cursor-pointer hover:bg-[#FAF7F5] transition-colors">
                                <input
                                    type="radio"
                                    name="backgroundType"
                                    checked={useCustomBackground}
                                    onChange={() => setUseCustomBackground(true)}
                                    className="w-4 h-4 text-[#E91E8C] focus:ring-[#E91E8C]"
                                />
                                <div>
                                    <p className="font-medium text-[#5C4A3D]">Background Kustom</p>
                                    <p className="text-sm text-[#A89080]">Upload gambar sendiri</p>
                                </div>
                            </label>
                        </div>

                        {/* Upload Section - Only show when custom is selected */}
                        {useCustomBackground && (
                            <div className="space-y-4">
                                {/* Current Background Preview */}
                                {formData.backgroundImageUrl ? (
                                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-[#E5D5C5]">
                                        <Image
                                            src={formData.backgroundImageUrl}
                                            alt="Current background"
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, backgroundImageUrl: "" }))}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            title="Hapus gambar"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Upload Button - Only show if no image uploaded */}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                            className="w-full py-4 border-2 border-dashed border-[#E5D5C5] rounded-lg text-[#A89080] hover:border-[#E91E8C] hover:text-[#E91E8C] transition-colors flex flex-col items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isUploading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#E91E8C] border-t-transparent" />
                                                    <span>Mengupload...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="font-medium">Klik untuk upload gambar</span>
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}

                                {/* Size Recommendation */}
                                <div className="bg-[#FFF9F9] p-3 rounded-lg border border-[#F5E6E0]">
                                    <p className="text-sm text-[#5C4A3D] font-medium mb-1">📐 Rekomendasi Ukuran:</p>
                                    <p className="text-sm text-[#A89080]">
                                        <strong>1920 x 1080 piksel</strong> (rasio 16:9) untuk tampilan optimal di desktop dan mobile.
                                        Maksimal ukuran file <strong>5MB</strong>.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full px-6 py-3 bg-[#E91E8C] text-white font-medium rounded-lg hover:bg-[#D91A7C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </form>

                {/* Preview */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#5C4A3D] mb-4">Preview</h2>
                    <div
                        className="rounded-lg p-6 min-h-[350px] flex items-center justify-center relative overflow-hidden"
                        style={{
                            backgroundColor: formData.secondaryColor,
                        }}
                    >
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${getCurrentBackgroundUrl()})`,
                            }}
                        >
                            <div className="absolute inset-0 bg-black/30"></div>
                        </div>

                        {/* Content */}
                        <div className="text-center relative z-10">
                            <p className="text-sm mb-2 text-white/80">
                                The Wedding of
                            </p>
                            <h3
                                className="text-3xl mb-4 text-white"
                                style={{
                                    fontFamily: formData.fontFamily,
                                }}
                            >
                                Romeo & Juliet
                            </h3>
                            <button
                                type="button"
                                className="px-6 py-2 rounded-full text-white text-sm"
                                style={{ backgroundColor: formData.primaryColor }}
                            >
                                Buka Undangan
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-[#A89080] mt-4 text-center">
                        Tema: {formData.themeName}
                    </p>
                </div>
            </div>
        </div>
    );
}
