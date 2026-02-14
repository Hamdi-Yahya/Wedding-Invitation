import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlug, generateQRString } from "@/lib/utils";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const all = searchParams.get("all");

        const whereClause = all === "true" ? {} : { isApproved: true };

        const wishes = await prisma.wish.findMany({
            where: whereClause,
            include: {
                guest: {
                    select: { name: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(wishes);
    } catch (error) {
        console.error("Error fetching wishes:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data ucapan" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.name || !body.name.trim()) {
            return NextResponse.json(
                { error: "Nama wajib diisi" },
                { status: 400 }
            );
        }

        if (!body.message || !body.message.trim()) {
            return NextResponse.json(
                { error: "Ucapan wajib diisi" },
                { status: 400 }
            );
        }

        const slug = generateSlug(body.name);
        const qrCodeString = generateQRString();

        let guest = await prisma.guest.findUnique({
            where: { slug },
        });

        if (!guest) {
            guest = await prisma.guest.create({
                data: {
                    name: body.name.trim(),
                    phoneNumber: null,
                    category: "Regular",
                    slug,
                    qrCodeString,
                    rsvpStatus: "Pending",
                    guestCount: 1,
                },
            });
        }

        const wish = await prisma.wish.create({
            data: {
                guestId: guest.id,
                message: body.message.trim(),
                isApproved: false,
            },
            include: {
                guest: {
                    select: { name: true },
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: "Ucapan berhasil dikirim dan menunggu persetujuan",
            wish: {
                id: wish.id,
                guestName: wish.guest.name,
                message: wish.message,
                createdAt: wish.createdAt,
            },
        }, { status: 201 });
    } catch (error) {
        console.error("Error submitting wish:", error);
        return NextResponse.json(
            { error: "Gagal mengirim ucapan" },
            { status: 500 }
        );
    }
}
