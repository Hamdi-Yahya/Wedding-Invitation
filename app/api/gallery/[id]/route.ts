import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const updatedImage = await prisma.galleryImage.update({
            where: { id: parseInt(id) },
            data: {
                imageUrl: body.imageUrl,
                altText: body.altText,
                sortOrder: body.sortOrder,
                isActive: body.isActive,
            },
        });

        return NextResponse.json(updatedImage);
    } catch (error) {
        console.error("Error updating gallery image:", error);
        return NextResponse.json(
            { error: "Failed to update gallery image" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.galleryImage.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting gallery image:", error);
        return NextResponse.json(
            { error: "Failed to delete gallery image" },
            { status: 500 }
        );
    }
}
