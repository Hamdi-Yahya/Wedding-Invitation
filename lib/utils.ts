// Utility functions untuk Wedding Invitation Platform

import { v4 as uuidv4 } from "uuid";

/**
 * Generate unique slug dari nama tamu
 * Format: nama-tamu-xxxx (dengan 4 karakter random)
 * @param name - Nama tamu
 * @returns String slug yang unique
 */
export function generateSlug(name: string): string {
    const baseSlug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, "") // Hapus karakter spesial
        .replace(/\s+/g, "-"); // Ganti spasi dengan dash

    const uniqueId = uuidv4().substring(0, 8);
    return `${baseSlug}-${uniqueId}`;
}

/**
 * Generate unique QR code string
 * Format: 5 karakter campuran huruf dan angka (uppercase)
 * @returns String unique 5 karakter untuk QR code
 */
export function generateQRString(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Format tanggal ke format Indonesia
 * @param date - Date object
 * @returns String tanggal format Indonesia (e.g., "Sabtu, 15 Juni 2026")
 */
export function formatDateIndonesia(date: Date): string {
    return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

/**
 * Format waktu ke format Indonesia
 * @param time - String waktu format HH:mm
 * @returns String waktu dengan WIB
 */
export function formatTimeIndonesia(time: string): string {
    return `${time} WIB`;
}

/**
 * Sanitize string untuk mencegah XSS
 * @param str - String input
 * @returns String yang sudah di-sanitize
 */
export function sanitizeString(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Validasi format nomor HP Indonesia
 * @param phone - Nomor HP
 * @returns Boolean valid atau tidak
 */
export function isValidPhoneNumber(phone: string): boolean {
    // Format: 08xxxxxxxxxx atau +628xxxxxxxxx
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ""));
}

/**
 * Format nomor HP ke format WhatsApp (62xxxxxxxxx)
 * @param phone - Nomor HP
 * @returns String nomor HP format WhatsApp
 */
export function formatPhoneForWhatsApp(phone: string): string {
    let cleaned = phone.replace(/[\s-]/g, "");

    if (cleaned.startsWith("+62")) {
        cleaned = cleaned.substring(1);
    } else if (cleaned.startsWith("0")) {
        cleaned = "62" + cleaned.substring(1);
    }

    return cleaned;
}

/**
 * Truncate string dengan ellipsis
 * @param str - String input
 * @param maxLength - Panjang maksimal
 * @returns String yang sudah di-truncate
 */
export function truncateString(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + "...";
}
