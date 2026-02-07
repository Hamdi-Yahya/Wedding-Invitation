// Prisma Client Singleton untuk Next.js
// Mencegah multiple instance Prisma Client di development mode

// Prisma 6.x - import standard dari @prisma/client
import { PrismaClient } from "@prisma/client";

/**
 * Membuat global type untuk prisma client
 * Diperlukan untuk mencegah multiple instances saat hot-reload
 */
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

/**
 * Prisma client instance
 * Menggunakan singleton pattern untuk efisiensi koneksi database
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Simpan ke global object di development mode
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export default prisma;
