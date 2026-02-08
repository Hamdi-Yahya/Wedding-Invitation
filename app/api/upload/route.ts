// API route untuk upload gambar (gallery dan background)
// Endpoint: POST /api/upload

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * POST - Upload file gambar
 * Mendukung upload untuk gallery dan background
 */
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const type = formData.get("type") as string || "gallery";

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        // Validasi tipe file
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Tipe file tidak didukung. Gunakan JPEG, PNG, WebP, atau GIF." },
                { status: 400 }
            );
        }

        // Validasi ukuran file (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "Ukuran file terlalu besar. Maksimal 5MB." },
                { status: 400 }
            );
        }

        // Buat folder uploads jika belum ada
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch {
            // Folder sudah ada
        }

        // Generate unique filename berdasarkan tipe
        const timestamp = Date.now();
        const extension = file.name.split(".").pop();
        const prefix = type === "background" ? "background" : "gallery";
        const filename = `${prefix}_${timestamp}.${extension}`;
        const filepath = path.join(uploadDir, filename);

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filepath, buffer);

        // Return URL path
        const imageUrl = `/uploads/${filename}`;

        return NextResponse.json({
            success: true,
            url: imageUrl,
            imageUrl,
            filename,
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { error: "Gagal mengupload file" },
            { status: 500 }
        );
    }
}
