"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface EventSettingsData {
    partner1Name: string;
    partner2Name: string;
    tagline: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    venueName: string;
    venueAddress: string;
    mapLinkUrl: string;
    waTemplateMsg: string;
    ceremonyTitle: string;
    ceremonyTime: string;
    ceremonyVenue: string;
    ceremonyAddress: string;
    receptionTitle: string;
    receptionTime: string;
    receptionVenue: string;
    receptionNote: string;
    dressCodeTitle: string;
    dressCodeNote: string;
    dressCodeStyle1: string;
    dressCodeStyle2: string;
}

export default function EventSettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<EventSettingsData>({
        partner1Name: "",
        partner2Name: "",
        tagline: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        venueName: "",
        venueAddress: "",
        mapLinkUrl: "",
        waTemplateMsg: "",
        ceremonyTitle: "The Ceremony",
        ceremonyTime: "",
        ceremonyVenue: "",
        ceremonyAddress: "",
        receptionTitle: "The Reception",
        receptionTime: "",
        receptionVenue: "",
        receptionNote: "",
        dressCodeTitle: "Dress Code",
        dressCodeNote: "",
        dressCodeStyle1: "Formal Attire",
        dressCodeStyle2: "Smart Casual",
    });

    useEffect(() => {
        async function fetchEventSettings() {
            try {
                const [eventRes, weddingRes] = await Promise.all([
                    fetch("/api/event-settings"),
                    fetch("/api/wedding-details")
                ]);

                const eventData = eventRes.ok ? await eventRes.json() : {};
                const weddingData = weddingRes.ok ? await weddingRes.json() : {};

                setFormData({
                    partner1Name: eventData.partner1Name || "",
                    partner2Name: eventData.partner2Name || "",
                    tagline: eventData.tagline || "",
                    eventDate: eventData.eventDate
                        ? new Date(eventData.eventDate).toISOString().split("T")[0]
                        : "",
                    startTime: eventData.startTime || "",
                    endTime: eventData.endTime || "",
                    venueName: eventData.venueName || "",
                    venueAddress: eventData.venueAddress || "",
                    mapLinkUrl: eventData.mapLinkUrl || "",
                    waTemplateMsg: eventData.waTemplateMsg || "",
                    ceremonyTitle: weddingData.ceremonyTitle || "The Ceremony",
                    ceremonyTime: weddingData.ceremonyTime || "",
                    ceremonyVenue: weddingData.ceremonyVenue || "",
                    ceremonyAddress: weddingData.ceremonyAddress || "",
                    receptionTitle: weddingData.receptionTitle || "The Reception",
                    receptionTime: weddingData.receptionTime || "",
                    receptionVenue: weddingData.receptionVenue || "",
                    receptionNote: weddingData.receptionNote || "",
                    dressCodeTitle: weddingData.dressCodeTitle || "Dress Code",
                    dressCodeNote: weddingData.dressCodeNote || "",
                    dressCodeStyle1: weddingData.dressCodeStyle1 || "Formal Attire",
                    dressCodeStyle2: weddingData.dressCodeStyle2 || "Smart Casual",
                });
            } catch (error) {
                console.error("Error fetching event settings:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchEventSettings();
    }, []);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSaving(true);

        try {
            const eventData = {
                partner1Name: formData.partner1Name,
                partner2Name: formData.partner2Name,
                tagline: formData.tagline,
                eventDate: formData.eventDate,
                startTime: formData.startTime,
                endTime: formData.endTime,
                venueName: formData.venueName,
                venueAddress: formData.venueAddress,
                mapLinkUrl: formData.mapLinkUrl,
                waTemplateMsg: formData.waTemplateMsg,
            };

            const weddingData = {
                ceremonyTitle: formData.ceremonyTitle,
                ceremonyTime: formData.ceremonyTime,
                ceremonyVenue: formData.ceremonyVenue,
                ceremonyAddress: formData.ceremonyAddress,
                receptionTitle: formData.receptionTitle,
                receptionTime: formData.receptionTime,
                receptionVenue: formData.receptionVenue,
                receptionNote: formData.receptionNote,
                dressCodeTitle: formData.dressCodeTitle,
                dressCodeNote: formData.dressCodeNote,
                dressCodeStyle1: formData.dressCodeStyle1,
                dressCodeStyle2: formData.dressCodeStyle2,
            };

            const [eventRes, weddingRes] = await Promise.all([
                fetch("/api/event-settings", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(eventData),
                }),
                fetch("/api/wedding-details", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(weddingData),
                }),
            ]);

            if (eventRes.ok && weddingRes.ok) {
                alert("Perubahan berhasil disimpan!");
            } else {
                alert("Gagal menyimpan perubahan");
            }
        } catch (error) {
            console.error("Error saving:", error);
            alert("Terjadi kesalahan");
        } finally {
            setIsSaving(false);
        }
    }

    function handleDiscard() {
        router.refresh();
    }

    function getMapPreviewUrl(mapUrl: string): string {
        if (!mapUrl) return "";
        if (mapUrl.includes("embed")) return mapUrl;
        return `https://www.google.com/maps?q=${encodeURIComponent(mapUrl)}&output=embed`;
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
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Event Details</h1>
                    <p className="text-gray-500 mt-1">
                        Manage the core details of your wedding ceremony and reception.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        className="px-5 py-2.5 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Preview Site
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="px-5 py-2.5 bg-[#E91E8C] text-white rounded-full hover:bg-[#D41B7F] transition-colors disabled:opacity-50"
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Couple&apos;s Information
                        </h2>
                        <span className="text-[#E91E8C]">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Partner 1 Name
                            </label>
                            <input
                                type="text"
                                name="partner1Name"
                                value={formData.partner1Name}
                                onChange={handleChange}
                                placeholder="Sarah Jenkins"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Partner 2 Name
                            </label>
                            <input
                                type="text"
                                name="partner2Name"
                                value={formData.partner2Name}
                                onChange={handleChange}
                                placeholder="James Peterson"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Wedding Tagline
                        </label>
                        <input
                            type="text"
                            name="tagline"
                            value={formData.tagline}
                            onChange={handleChange}
                            placeholder="Together with their families"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Date & Time</h2>
                        <span className="text-[#E91E8C]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                name="eventDate"
                                value={formData.eventDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Time
                            </label>
                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Time (Approx)
                            </label>
                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Location & Venue
                        </h2>
                        <span className="text-[#E91E8C]">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Venue Name
                                </label>
                                <input
                                    type="text"
                                    name="venueName"
                                    value={formData.venueName}
                                    onChange={handleChange}
                                    placeholder="Rosewood Estate Gardens"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Address
                                </label>
                                <textarea
                                    name="venueAddress"
                                    value={formData.venueAddress}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder={"123 Blossom Lane,\nBeverly Hills, CA 90210"}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Map Link URL
                                </label>
                                <div className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    <input
                                        type="text"
                                        name="mapLinkUrl"
                                        value={formData.mapLinkUrl}
                                        onChange={handleChange}
                                        placeholder="https://maps.google.com/..."
                                        className="flex-1 bg-transparent outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Map Preview
                            </label>
                            <div className="h-64 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                                {formData.mapLinkUrl ? (
                                    <iframe
                                        src={getMapPreviewUrl(formData.mapLinkUrl)}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Map Preview"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <div className="text-center">
                                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                            </svg>
                                            <p className="text-sm">Enter Map URL to preview</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">The Ceremony</h2>
                        <span className="text-[#E91E8C]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                            </svg>
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                            <input
                                type="text"
                                name="ceremonyTitle"
                                value={formData.ceremonyTitle}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Waktu</label>
                            <input
                                type="text"
                                name="ceremonyTime"
                                value={formData.ceremonyTime}
                                onChange={handleChange}
                                placeholder="09:00 WIB"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Venue</label>
                            <input
                                type="text"
                                name="ceremonyVenue"
                                value={formData.ceremonyVenue}
                                onChange={handleChange}
                                placeholder="Gereja / Masjid / dll"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                            <input
                                type="text"
                                name="ceremonyAddress"
                                value={formData.ceremonyAddress}
                                onChange={handleChange}
                                placeholder="Alamat venue ceremony"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">The Reception</h2>
                        <span className="text-[#E91E8C]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                            </svg>
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                            <input
                                type="text"
                                name="receptionTitle"
                                value={formData.receptionTitle}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Waktu</label>
                            <input
                                type="text"
                                name="receptionTime"
                                value={formData.receptionTime}
                                onChange={handleChange}
                                placeholder="11:00 - Selesai"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Venue</label>
                            <input
                                type="text"
                                name="receptionVenue"
                                value={formData.receptionVenue}
                                onChange={handleChange}
                                placeholder="Ballroom / Gedung / dll"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
                            <input
                                type="text"
                                name="receptionNote"
                                value={formData.receptionNote}
                                onChange={handleChange}
                                placeholder="Party starts..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Dress Code</h2>
                        <span className="text-[#E91E8C]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Judul</label>
                            <input
                                type="text"
                                name="dressCodeTitle"
                                value={formData.dressCodeTitle}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
                            <input
                                type="text"
                                name="dressCodeNote"
                                value={formData.dressCodeNote}
                                onChange={handleChange}
                                placeholder="We'd Love..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Style 1</label>
                            <input
                                type="text"
                                name="dressCodeStyle1"
                                value={formData.dressCodeStyle1}
                                onChange={handleChange}
                                placeholder="Formal Attire"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Style 2</label>
                            <input
                                type="text"
                                name="dressCodeStyle2"
                                value={formData.dressCodeStyle2}
                                onChange={handleChange}
                                placeholder="Smart Casual"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={handleDiscard}
                        className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-3 bg-[#E91E8C] text-white rounded-xl hover:bg-[#D41B7F] transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
