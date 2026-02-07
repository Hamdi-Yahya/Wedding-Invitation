// Theme Settings Page
// Form untuk mengelola tema undangan

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
 * Form untuk update tema undangan
 */
export default function ThemeSettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
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
                <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm">
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
                    <div className="mb-6">
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
                        className="rounded-lg p-6 min-h-[300px] flex items-center justify-center"
                        style={{
                            backgroundColor: formData.secondaryColor,
                            backgroundImage: formData.backgroundImageUrl
                                ? `url(${formData.backgroundImageUrl})`
                                : "none",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <div className="text-center">
                            <p
                                className="text-sm mb-2"
                                style={{ color: formData.primaryColor }}
                            >
                                The Wedding of
                            </p>
                            <h3
                                className="text-3xl mb-4"
                                style={{
                                    color: formData.primaryColor,
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
