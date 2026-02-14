import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT() {
    try {
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
