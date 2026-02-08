// Hero Section Component
// Section pembuka undangan dengan nama pasangan, foto, dan countdown

"use client";

import { useState, useEffect } from "react";

/**
 * Props untuk HeroSection
 */
interface HeroSectionProps {
    guestName: string;
    partner1Name: string;
    partner2Name: string;
    tagline: string;
    eventDate: Date;
    primaryColor: string;
    secondaryColor: string;
    backgroundImageUrl?: string;
}

/**
 * Default background image URL
 */
const DEFAULT_BACKGROUND_URL = "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=1600";

/**
 * HeroSection Component
 * Menampilkan hero dengan foto pasangan, nama, dan countdown
 */
export default function HeroSection({
    guestName,
    partner1Name,
    partner2Name,
    tagline,
    eventDate,
    primaryColor,
    backgroundImageUrl,
}: HeroSectionProps) {
    const [countdown, setCountdown] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    /**
     * Calculate countdown to event date
     */
    useEffect(() => {
        const targetDate = new Date(eventDate).getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance > 0) {
                setCountdown({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor(
                        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                    ),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [eventDate]);

    /**
     * Format tanggal untuk display
     */
    const formattedEventDate = new Date(eventDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    /**
     * Get background image URL (custom or default)
     */
    function getBackgroundUrl(): string {
        if (backgroundImageUrl && backgroundImageUrl.trim() !== "") {
            return backgroundImageUrl;
        }
        return DEFAULT_BACKGROUND_URL;
    }

    return (
        <section className="relative">
            {/* Navigation Header */}
            <nav className="absolute top-0 left-0 right-0 z-20 px-8 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <svg className="w-6 h-6" style={{ color: primaryColor }} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span className="text-white font-medium text-lg" style={{ fontFamily: "'Parisienne', cursive" }}>
                            {partner1Name.charAt(0).toUpperCase()}&{partner2Name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-white/90 text-sm">
                        <a href="#details" className="hover:text-white transition-colors">Home</a>
                        <a href="#details" className="hover:text-white transition-colors">Event</a>
                        <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
                        <a href="#rsvp" className="px-5 py-2 rounded-full transition-colors text-white" style={{ backgroundColor: primaryColor }}>RSVP</a>
                    </div>
                </div>
            </nav>

            {/* Hero Image Background */}
            <div className="relative h-[600px] md:h-[700px]">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('${getBackgroundUrl()}')`,
                    }}
                >
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                    {/* Kepada */}
                    <p className="text-white/80 text-sm mb-2">THE WEDDING OF</p>

                    {/* Couple Names */}
                    <h1
                        className="text-5xl md:text-7xl text-white mb-4"
                        style={{ fontFamily: "'Parisienne', cursive" }}
                    >
                        {partner1Name} & {partner2Name}
                    </h1>

                    {/* Tagline */}
                    {tagline && (
                        <p className="text-white/90 text-sm md:text-base mb-8 max-w-md">
                            {tagline}
                        </p>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-4">
                        <a
                            href="#rsvp"
                            className="px-8 py-3 text-white rounded-full transition-colors font-medium hover:opacity-90"
                            style={{ backgroundColor: primaryColor }}
                        >
                            RSVP Now
                        </a>
                        <a
                            href="#details"
                            className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors border border-white/50"
                        >
                            👔🎀 Dress Costume
                        </a>
                    </div>
                </div>
            </div>

            {/* Date & Countdown Strip */}
            <div className="relative -mt-16 z-10 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Date Display */}
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full" style={{ backgroundColor: `${primaryColor}15` }}>
                                <svg className="w-6 h-6" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-800">{formattedEventDate}</p>
                                <p className="text-sm text-gray-500">Save the Date</p>
                            </div>
                        </div>

                        {/* Countdown */}
                        <div className="flex items-center gap-2">
                            {[
                                { value: countdown.days, label: "Days" },
                                { value: countdown.hours, label: "Hours" },
                                { value: countdown.minutes, label: "Mins" },
                                { value: countdown.seconds, label: "Secs" },
                            ].map((item, index) => (
                                <div
                                    key={item.label}
                                    className="flex items-center"
                                >
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex flex-col items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>
                                        <span className="text-lg md:text-xl font-bold">
                                            {item.value.toString().padStart(2, "0")}
                                        </span>
                                        <span className="text-[9px] md:text-[10px] uppercase">{item.label}</span>
                                    </div>
                                    {index < 3 && (
                                        <span className="text-gray-300 text-xl md:text-2xl mx-1">:</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
