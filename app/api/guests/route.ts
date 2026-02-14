import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlug, generateQRString } from "@/lib/utils";

export async function GET() {
    try {
        const guests = await prisma.guest.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(guests);
    } catch (error) {
        console.error("Error fetching guests:", error);
        return NextResponse.json(
            { error: "Failed to fetch guests" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.name) {
            return NextResponse.json(
                { error: "Nama tamu wajib diisi" },
                { status: 400 }
            );
        }

        const slug = generateSlug(body.name);
        const qrCodeString = generateQRString();

        const guest = await prisma.guest.create({
            data: {
                name: body.name,
                phoneNumber: body.phoneNumber || null,
                category: body.category || "Regular",
                slug,
                qrCodeString,
            },
        });

        return NextResponse.json(guest, { status: 201 });
    } catch (error) {
        console.error("Error creating guest:", error);
        return NextResponse.json(
            { error: "Failed to create guest" },
            { status: 500 }
        );
    }
}
