import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Parisienne,
  Playfair_Display,
  Great_Vibes,
  Cormorant_Garamond,
  Lora,
  Merriweather,
  Crimson_Text,
  Libre_Baskerville
} from "next/font/google";
import "./globals.css";

/**
 * Font Geist Sans untuk teks umum
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Font Geist Mono untuk kode
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Font Parisienne untuk typography script/cursive
 */
const parisienne = Parisienne({
  variable: "--font-parisienne",
  subsets: ["latin"],
  weight: "400",
});

/**
 * Font Playfair Display untuk undangan
 */
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

/**
 * Font Great Vibes untuk undangan
 */
const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

/**
 * Font Cormorant Garamond untuk undangan
 */
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

/**
 * Font Lora untuk undangan
 */
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

/**
 * Font Merriweather untuk undangan
 */
const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
});

/**
 * Font Crimson Text untuk undangan
 */
const crimsonText = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

/**
 * Font Libre Baskerville untuk undangan
 */
const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre",
  subsets: ["latin"],
  weight: ["400", "700"],
});

/**
 * Metadata untuk SEO
 */
export const metadata: Metadata = {
  title: "Wedding Invitation Platform",
  description: "Platform undangan pernikahan digital dengan QR code dan RSVP online",
};

/**
 * RootLayout Component
 * Layout root aplikasi dengan font dan metadata
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${parisienne.variable} ${playfairDisplay.variable} ${greatVibes.variable} ${cormorantGaramond.variable} ${lora.variable} ${merriweather.variable} ${crimsonText.variable} ${libreBaskerville.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
