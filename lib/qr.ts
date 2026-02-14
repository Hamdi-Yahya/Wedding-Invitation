import QRCode from "qrcode";

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

export function isValidQRString(qrString: string): boolean {
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(qrString);
}
