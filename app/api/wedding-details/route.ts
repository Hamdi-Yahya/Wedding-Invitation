// API route untuk wedding details
// Endpoint: GET/PUT /api/wedding-details

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET - Ambil wedding details
 */
export async function GET() {
    try {
        // Cari atau buat default wedding details
        let details = await prisma.weddingDetails.findFirst({
            where: { id: 1 },
        });

        // Jika belum ada, buat default
        if (!details) {
            details = await prisma.weddingDetails.create({
                data: {
                    ceremonyTitle: "The Ceremony",
                    ceremonyTime: "",
                    ceremonyVenue: "",
                    ceremonyAddress: "",
                    receptionTitle: "The Reception",
                    receptionTime: "",
                    receptionVenue: "",
                    receptionNote: "Party starts...",
                    dressCodeTitle: "Dress Code",
                    dressCodeNote: "We'd Love...",
                    dressCodeStyle1: "Formal Attire",
                    dressCodeStyle2: "Smart Casual",
                },
            });
        }

        return NextResponse.json(details);
    } catch (error) {
        console.error("Error fetching wedding details:", error);
        return NextResponse.json(
            { error: "Failed to fetch wedding details" },
            { status: 500 }
        );
    }
}

/**
 * PUT - Update wedding details
 */
export async function PUT(request: Request) {
    try {
        const body = await request.json();

        const updated = await prisma.weddingDetails.upsert({
            where: { id: 1 },
            update: {
                ceremonyTitle: body.ceremonyTitle,
                ceremonyTime: body.ceremonyTime,
                ceremonyVenue: body.ceremonyVenue,
                ceremonyAddress: body.ceremonyAddress,
                receptionTitle: body.receptionTitle,
                receptionTime: body.receptionTime,
                receptionVenue: body.receptionVenue,
                receptionNote: body.receptionNote,
                dressCodeTitle: body.dressCodeTitle,
                dressCodeNote: body.dressCodeNote,
                dressCodeStyle1: body.dressCodeStyle1,
                dressCodeStyle2: body.dressCodeStyle2,
            },
            create: {
                ceremonyTitle: body.ceremonyTitle || "The Ceremony",
                ceremonyTime: body.ceremonyTime,
                ceremonyVenue: body.ceremonyVenue,
                ceremonyAddress: body.ceremonyAddress,
                receptionTitle: body.receptionTitle || "The Reception",
                receptionTime: body.receptionTime,
                receptionVenue: body.receptionVenue,
                receptionNote: body.receptionNote,
                dressCodeTitle: body.dressCodeTitle || "Dress Code",
                dressCodeNote: body.dressCodeNote,
                dressCodeStyle1: body.dressCodeStyle1,
                dressCodeStyle2: body.dressCodeStyle2,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating wedding details:", error);
        return NextResponse.json(
            { error: "Failed to update wedding details" },
            { status: 500 }
        );
    }
}
