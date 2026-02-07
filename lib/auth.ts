// NextAuth v5 (Auth.js) configuration
// Menggunakan Credentials provider untuk login admin

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/**
 * NextAuth configuration dengan Credentials provider
 * Digunakan untuk autentikasi admin dashboard
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            /**
             * Authorize function untuk validasi login
             * @param credentials - Username dan password dari form
             * @returns User object atau null jika gagal
             */
            async authorize(credentials) {
                // Validasi input
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                try {
                    // Cari admin berdasarkan username
                    const admin = await prisma.admin.findUnique({
                        where: { username: credentials.username as string },
                    });

                    // Jika admin tidak ditemukan
                    if (!admin) {
                        return null;
                    }

                    // Verifikasi password
                    const isPasswordValid = await bcrypt.compare(
                        credentials.password as string,
                        admin.password
                    );

                    if (!isPasswordValid) {
                        return null;
                    }

                    // Return user object (tanpa password)
                    return {
                        id: admin.id.toString(),
                        name: admin.username,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/login", // Custom login page
        error: "/login", // Error page
    },
    callbacks: {
        /**
         * JWT callback - menambahkan info user ke token
         */
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        /**
         * Session callback - menambahkan info user ke session
         */
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
        /**
         * Authorized callback - proteksi route
         */
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            const isOnLogin = nextUrl.pathname === "/login";

            // Jika akses dashboard tapi belum login
            if (isOnDashboard && !isLoggedIn) {
                return false; // Redirect ke login
            }

            // Jika sudah login dan akses login page
            if (isOnLogin && isLoggedIn) {
                return Response.redirect(new URL("/dashboard", nextUrl));
            }

            return true;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
});
