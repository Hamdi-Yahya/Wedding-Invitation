// API route untuk approve all wishes
// Endpoint: PUT /api/wishes/approve-all

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * PUT - Approve semua wishes sekaligus
 */
export async function PUT() {
    try {
        // Update semua wishes yang belum di-approve
        const result = await prisma.wish.updateMany({
            where: { isApproved: false },
            data: { isApproved: true },
        });

        return NextResponse.json({
            success: true,
            message: `${result.count} ucapan berhasil disetujui`,
            count: result.count,
        });
    } catch (error) {
        console.error("Error approving all wishes:", error);
        return NextResponse.json(
            { error: "Gagal menyetujui semua ucapan" },
            { status: 500 }
        );
    }
}
