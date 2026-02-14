import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlug, generateQRString } from "@/lib/utils";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.slug && (!body.name || !body.name.trim())) {
            return NextResponse.json(
                { error: "Nama wajib diisi" },
                { status: 400 }
            );
        }

        if (!body.rsvpStatus || !["Coming", "Not Coming", "Pending"].includes(body.rsvpStatus)) {
            return NextResponse.json(
                { error: "Status RSVP tidak valid" },
                { status: 400 }
            );
        }

        let guest;

        if (body.slug) {
            const existingGuest = await prisma.guest.findUnique({
                where: { slug: body.slug },
            });

            if (!existingGuest) {
                return NextResponse.json(
                    { error: "Tamu tidak ditemukan" },
                    { status: 404 }
                );
            }

            guest = await prisma.guest.update({
                where: { id: existingGuest.id },
                data: {
                    rsvpStatus: body.rsvpStatus,
                    guestCount: body.guestCount || 1,
                    phoneNumber: body.phoneNumber || existingGuest.phoneNumber,
                },
            });
        } else {
            const slug = generateSlug(body.name);
            const existingGuest = await prisma.guest.findUnique({
                where: { slug },
            });

            if (existingGuest) {
                guest = await prisma.guest.update({
                    where: { id: existingGuest.id },
                    data: {
                        rsvpStatus: body.rsvpStatus,
                        guestCount: body.guestCount || 1,
                        phoneNumber: body.phoneNumber || existingGuest.phoneNumber,
                    },
                });
            } else {
                const qrCodeString = generateQRString();
                guest = await prisma.guest.create({
                    data: {
                        name: body.name.trim(),
                        phoneNumber: body.phoneNumber || null,
                        category: "Regular",
                        slug,
                        qrCodeString,
                        rsvpStatus: body.rsvpStatus,
                        guestCount: body.guestCount || 1,
                    },
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: "RSVP berhasil disimpan",
            guest: {
                id: guest.id,
                name: guest.name,
                slug: guest.slug,
                rsvpStatus: guest.rsvpStatus,
                guestCount: guest.guestCount,
            },
        });
    } catch (error) {
        console.error("Error submitting RSVP:", error);
        return NextResponse.json(
            { error: "Gagal menyimpan RSVP" },
            { status: 500 }
        );
    }
}
