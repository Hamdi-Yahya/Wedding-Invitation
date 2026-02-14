import { v4 as uuidv4 } from "uuid";

export function generateSlug(name: string): string {
    const baseSlug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-");

    const uniqueId = uuidv4().substring(0, 8);
    return `${baseSlug}-${uniqueId}`;
}

export function generateQRString(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function formatDateIndonesia(date: Date): string {
    return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

export function formatTimeIndonesia(time: string): string {
    return `${time} WIB`;
}

export function sanitizeString(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export function isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ""));
}

export function formatPhoneForWhatsApp(phone: string): string {
    let cleaned = phone.replace(/[\s-]/g, "");

    if (cleaned.startsWith("+62")) {
        cleaned = cleaned.substring(1);
    } else if (cleaned.startsWith("0")) {
        cleaned = "62" + cleaned.substring(1);
    }

    return cleaned;
}

export function truncateString(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + "...";
}
