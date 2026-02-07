// Wishes Section Component
// Section ucapan dari tamu - mode publik

"use client";

import { useState } from "react";

/**
 * Interface untuk data wish
 */
interface WishData {
    id: number;
    guestName: string;
    message: string;
    createdAt: string;
}

/**
 * Props untuk WishesSection
 */
interface WishesSectionProps {
    wishes: WishData[];
    primaryColor: string;
    secondaryColor: string;
}

/**
 * WishesSection Component
 * Menampilkan daftar ucapan dan form untuk mengirim ucapan baru
 */
export default function WishesSection({
    wishes: initialWishes,
    primaryColor,
    secondaryColor,
}: WishesSectionProps) {
    const [wishes, setWishes] = useState<WishData[]>(initialWishes);
    const [formData, setFormData] = useState({
        name: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    /**
     * Handle input change
     */
    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    /**
     * Handle submit wish
     */
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!formData.name.trim() || !formData.message.trim()) {
            setSubmitMessage({
                type: "error",
                text: "Nama dan ucapan wajib diisi",
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            const response = await fetch("/api/wishes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    message: formData.message,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitMessage({
                    type: "success",
                    text: "Ucapan Anda akan ditampilkan setelah disetujui.",
                });
                // Reset form
                setFormData({ name: "", message: "" });
            } else {
                setSubmitMessage({
                    type: "error",
                    text: data.error || "Gagal mengirim ucapan",
                });
            }
        } catch (error) {
            console.error("Error submitting wish:", error);
            setSubmitMessage({
                type: "error",
                text: "Terjadi kesalahan. Silakan coba lagi.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    /**
     * Format tanggal untuk display
     */
    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    return (
        <section id="wishes" className="py-20 px-6" style={{ backgroundColor: secondaryColor }}>
            <div className="max-w-2xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-10">
                    <p
                        className="text-sm mb-2"
                        style={{ fontFamily: "'Parisienne', cursive", color: primaryColor }}
                    >
                        Kirim Doa & Ucapan
                    </p>
                    <h2 className="text-2xl font-bold text-gray-800">Ucapan & Doa</h2>
                </div>

                {/* Submit Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl p-6 shadow-sm mb-8"
                >
                    {submitMessage && (
                        <div
                            className={`p-4 rounded-xl text-sm mb-4 ${submitMessage.type === "success"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                                }`}
                        >
                            {submitMessage.text}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Anda <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Masukkan nama Anda"
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ucapan & Doa <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Tulis ucapan dan doa untuk kedua mempelai..."
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 text-white font-medium rounded-xl transition-all hover:opacity-90 disabled:opacity-50"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {isSubmitting ? "Mengirim..." : "Kirim Ucapan"}
                        </button>
                    </div>
                </form>

                {/* Wishes List */}
                {wishes.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto mt-6">
                        {wishes.map((wish) => (
                            <div
                                key={wish.id}
                                className="bg-white rounded-xl p-3 shadow-sm"
                            >
                                <div className="flex items-start gap-2">
                                    {/* Avatar */}
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        {wish.guestName.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-gray-800 text-xs truncate">
                                                {wish.guestName}
                                            </h4>
                                            <span className="text-[10px] text-gray-400 ml-1 flex-shrink-0">
                                                {formatDate(wish.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-xs line-clamp-2">{wish.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {wishes.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        <p>Belum ada ucapan. Jadilah yang pertama!</p>
                    </div>
                )}
            </div>
        </section>
    );
}
