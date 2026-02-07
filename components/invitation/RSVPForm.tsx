// RSVP Form Component
// Form konfirmasi kehadiran tamu - mendukung mode publik dan personalized

"use client";

import { useState } from "react";

/**
 * Props untuk RSVPForm
 */
interface RSVPFormProps {
    primaryColor: string;
    secondaryColor: string;
    guestSlug?: string;  // Optional: slug tamu dari URL untuk update existing guest
    guestName?: string;  // Optional: nama tamu yang sudah diketahui
    guestPhone?: string; // Optional: nomor HP tamu yang sudah diketahui
}

/**
 * RSVPForm Component
 * Form untuk konfirmasi kehadiran dengan input nama tamu
 */
export default function RSVPForm({
    primaryColor,
    secondaryColor,
    guestSlug,
    guestName,
    guestPhone,
}: RSVPFormProps) {
    const [formData, setFormData] = useState({
        fullName: guestName || "",
        email: "",
        phoneNumber: guestPhone || "",
        rsvpStatus: "Coming",
        guestCount: 1,
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
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    /**
     * Handle submit RSVP
     */
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Jika ada slug, gunakan nama dari slug; jika tidak, validasi input nama
        if (!guestSlug && !formData.fullName.trim()) {
            setSubmitMessage({
                type: "error",
                text: "Nama lengkap wajib diisi",
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            const response = await fetch("/api/rsvp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug: guestSlug,  // Kirim slug untuk update existing guest
                    name: guestSlug ? guestName : formData.fullName,
                    phoneNumber: formData.phoneNumber,
                    rsvpStatus: formData.rsvpStatus,
                    guestCount: formData.rsvpStatus === "Coming" ? formData.guestCount : 0,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Jika dari halaman publik (tanpa slug), redirect ke halaman personalized
                if (!guestSlug && data.guest?.slug) {
                    setSubmitMessage({
                        type: "success",
                        text: "Terima kasih! Mengalihkan ke undangan Anda...",
                    });
                    // Redirect ke halaman personalized dengan QR code
                    setTimeout(() => {
                        window.location.href = `/invite/${data.guest.slug}`;
                    }, 1500);
                } else {
                    setSubmitMessage({
                        type: "success",
                        text: "Terima kasih! RSVP Anda sudah tercatat.",
                    });
                }
            } else {
                setSubmitMessage({
                    type: "error",
                    text: data.error || "Gagal mengirim RSVP",
                });
            }
        } catch (error) {
            console.error("Error submitting RSVP:", error);
            setSubmitMessage({
                type: "error",
                text: "Terjadi kesalahan. Silakan coba lagi.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section id="rsvp" className="py-20 px-6" style={{ backgroundColor: secondaryColor }}>
            <div className="max-w-xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Konfirmasi Kehadiran
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Kami sangat mengharapkan kehadiran Anda
                    </p>
                </div>

                {/* RSVP Form Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Message */}
                        {submitMessage && (
                            <div
                                className={`p-4 rounded-xl text-sm ${submitMessage.type === "success"
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                                    }`}
                            >
                                {submitMessage.text}
                            </div>
                        )}

                        {/* Full Name - ditampilkan hanya jika tidak ada slug */}
                        {!guestSlug ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Masukkan nama lengkap Anda"
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                                />
                            </div>
                        ) : (
                            <div className="p-4 rounded-xl text-center" style={{ backgroundColor: `${primaryColor}10` }}>
                                <p className="text-sm text-gray-600">Konfirmasi kehadiran untuk:</p>
                                <p className="text-lg font-semibold" style={{ color: primaryColor }}>{guestName}</p>
                            </div>
                        )}

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nomor WhatsApp
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="08xxxxxxxxxx"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Attendance Options */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Konfirmasi Kehadiran
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <label
                                    className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${formData.rsvpStatus === "Coming"
                                        ? ""
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    style={formData.rsvpStatus === "Coming" ? {
                                        borderColor: primaryColor,
                                        backgroundColor: `${primaryColor}10`
                                    } : {}}
                                >
                                    <input
                                        type="radio"
                                        name="rsvpStatus"
                                        value="Coming"
                                        checked={formData.rsvpStatus === "Coming"}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-[#E91E8C] focus:ring-[#E91E8C]"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">Hadir</p>
                                        <p className="text-xs text-gray-500">Saya akan datang</p>
                                    </div>
                                </label>
                                <label
                                    className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${formData.rsvpStatus === "Not Coming"
                                        ? "border-gray-600 bg-gray-50"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="rsvpStatus"
                                        value="Not Coming"
                                        checked={formData.rsvpStatus === "Not Coming"}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-gray-600 focus:ring-gray-600"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">Tidak Hadir</p>
                                        <p className="text-xs text-gray-500">Maaf, tidak bisa</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 text-white font-medium rounded-xl transition-all hover:opacity-90 disabled:opacity-50"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {isSubmitting ? "Mengirim..." : "Kirim RSVP"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
