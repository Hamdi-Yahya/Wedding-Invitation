import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const action = body.action;

        if (action === "validate") {
            if (!body.qrCodeString) {
                return NextResponse.json(
                    { error: "QR code wajib diisi" },
                    { status: 400 }
                );
            }

            const guest = await prisma.guest.findUnique({
                where: { qrCodeString: body.qrCodeString },
                select: {
                    id: true,
                    name: true,
                    category: true,
                    rsvpStatus: true,
                    guestCount: true,
                    checkInTime: true,
                },
            });

            if (!guest) {
                return NextResponse.json(
                    { error: "QR code tidak valid atau tamu tidak ditemukan" },
                    { status: 404 }
                );
            }

            return NextResponse.json({ guest });
        }

        if (action === "checkin") {
            if (!body.guestId) {
                return NextResponse.json(
                    { error: "Guest ID wajib diisi" },
                    { status: 400 }
                );
            }

            const guest = await prisma.guest.update({
                where: { id: body.guestId },
                data: {
                    checkInTime: new Date(),
                    giftType: body.giftType || "None",
                },
            });

            return NextResponse.json({
                success: true,
                message: "Check-in berhasil",
                guest,
            });
        }

        return NextResponse.json(
            { error: "Action tidak valid" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Error processing check-in:", error);
        return NextResponse.json(
            { error: "Gagal memproses check-in" },
            { status: 500 }
        );
    }
}
