// API Route untuk EventSettings
// GET: Ambil data event settings
// PUT: Update data event settings

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/event-settings
 * Mengambil data event settings (ID = 1)
 */
export async function GET() {
    try {
        const eventSettings = await prisma.eventSettings.findFirst({
            where: { id: 1 },
        });

        if (!eventSettings) {
            return NextResponse.json(null, { status: 404 });
        }

        return NextResponse.json(eventSettings);
    } catch (error) {
        console.error("Error fetching event settings:", error);
        return NextResponse.json(
            { error: "Failed to fetch event settings" },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/event-settings
 * Update data event settings
 */
export async function PUT(request: Request) {
    try {
        const body = await request.json();

        const eventSettings = await prisma.eventSettings.upsert({
            where: { id: 1 },
            update: {
                partner1Name: body.partner1Name,
                partner2Name: body.partner2Name,
                tagline: body.tagline,
                eventDate: new Date(body.eventDate),
                startTime: body.startTime,
                endTime: body.endTime,
                venueName: body.venueName,
                venueAddress: body.venueAddress,
                mapLinkUrl: body.mapLinkUrl,
                waTemplateMsg: body.waTemplateMsg,
            },
            create: {
                partner1Name: body.partner1Name,
                partner2Name: body.partner2Name,
                tagline: body.tagline,
                eventDate: new Date(body.eventDate),
                startTime: body.startTime,
                endTime: body.endTime,
                venueName: body.venueName,
                venueAddress: body.venueAddress,
                mapLinkUrl: body.mapLinkUrl,
                waTemplateMsg: body.waTemplateMsg,
            },
        });

        return NextResponse.json(eventSettings);
    } catch (error) {
        console.error("Error updating event settings:", error);
        return NextResponse.json(
            { error: "Failed to update event settings" },
            { status: 500 }
        );
    }
}
