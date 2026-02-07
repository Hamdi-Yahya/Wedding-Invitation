// QR Code generation utilities
// Menggunakan library qrcode untuk generate QR code

import QRCode from "qrcode";

/**
 * Generate QR Code sebagai Data URL (base64)
 * Digunakan untuk menampilkan QR di halaman web
 * @param data - String data yang akan di-encode ke QR
 * @returns Promise<string> - Data URL (base64) dari QR code
 */
export async function generateQRCodeDataURL(data: string): Promise<string> {
    try {
        const qrDataURL = await QRCode.toDataURL(data, {
            width: 300,
            margin: 2,
            color: {
                dark: "#000000",
                light: "#FFFFFF",
            },
            errorCorrectionLevel: "M",
        });
        return qrDataURL;
    } catch (error) {
        console.error("Error generating QR code:", error);
        throw new Error("Failed to generate QR code");
    }
}

/**
 * Generate QR Code sebagai SVG string
 * Digunakan untuk export/print dengan kualitas tinggi
 * @param data - String data yang akan di-encode ke QR
 * @returns Promise<string> - SVG string
 */
export async function generateQRCodeSVG(data: string): Promise<string> {
    try {
        const qrSVG = await QRCode.toString(data, {
            type: "svg",
            width: 300,
            margin: 2,
            color: {
                dark: "#000000",
                light: "#FFFFFF",
            },
            errorCorrectionLevel: "M",
        });
        return qrSVG;
    } catch (error) {
        console.error("Error generating QR code SVG:", error);
        throw new Error("Failed to generate QR code SVG");
    }
}

/**
 * Validasi QR code string
 * Memeriksa apakah string QR valid (UUID format)
 * @param qrString - String QR code
 * @returns Boolean - valid atau tidak
 */
export function isValidQRString(qrString: string): boolean {
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(qrString);
}
