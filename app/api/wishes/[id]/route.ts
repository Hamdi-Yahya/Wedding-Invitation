// API Route untuk single Wish
// PUT: Update approval status
// DELETE: Hapus ucapan

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * PUT /api/wishes/[id]
 * Update status approval ucapan
 */
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const wish = await prisma.wish.update({
            where: { id: parseInt(id) },
            data: {
                isApproved: body.isApproved,
            },
        });

        return NextResponse.json(wish);
    } catch (error) {
        console.error("Error updating wish:", error);
        return NextResponse.json(
            { error: "Failed to update wish" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/wishes/[id]
 * Hapus ucapan
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.wish.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting wish:", error);
        return NextResponse.json(
            { error: "Failed to delete wish" },
            { status: 500 }
        );
    }
}
