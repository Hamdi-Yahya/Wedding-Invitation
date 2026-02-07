// NextAuth Middleware untuk route protection
// Menggunakan auth dari konfigurasi auth.ts

import { auth } from "@/lib/auth";

export default auth;

export const config = {
    // Matcher untuk routes yang perlu di-protect
    matcher: ["/dashboard/:path*"],
};
