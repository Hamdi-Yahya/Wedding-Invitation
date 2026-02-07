// API route untuk gallery images
// Endpoint: GET/POST /api/gallery

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET - Ambil semua gallery images
 */
export async function GET() {
    try {
        const images = await prisma.galleryImage.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
        });

        return NextResponse.json(images);
    } catch (error) {
        console.error("Error fetching gallery images:", error);
        return NextResponse.json(
            { error: "Failed to fetch gallery images" },
            { status: 500 }
        );
    }
}

/**
 * POST - Tambah gallery image baru
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Dapatkan sortOrder tertinggi
        const maxOrder = await prisma.galleryImage.findFirst({
            orderBy: { sortOrder: "desc" },
            select: { sortOrder: true },
        });

        const newImage = await prisma.galleryImage.create({
            data: {
                imageUrl: body.imageUrl,
                altText: body.altText || null,
                sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
                isActive: true,
            },
        });

        return NextResponse.json(newImage, { status: 201 });
    } catch (error) {
        console.error("Error creating gallery image:", error);
        return NextResponse.json(
            { error: "Failed to create gallery image" },
            { status: 500 }
        );
    }
}
