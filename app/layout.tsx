import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/lib/auth/AuthProvider";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Tonal Field - Coolors Alternative for Advanced Color Palettes",
  description: "The smart alternative to Coolors. Generate accessible color palettes with energy-based design, auto-fix contrast issues, and export to 20+ formats. Better control, lower price.",
  keywords: [
    "coolors alternative",
    "color palette generator",
    "accessible color palettes",
    "color scheme generator",
    "design system colors",
    "contrast checker",
    "wcag color tool",
    "tailwind color palette",
    "figma color export",
    "material design colors",
  ],
  authors: [{ name: "Tonal Field" }],
  creator: "Tonal Field",
  publisher: "Tonal Field",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tonal-field.vercel.app",
    title: "Tonal Field - Smart Alternative to Coolors",
    description: "Generate accessible color palettes with energy-based design. Better control than Coolors, lower price.",
    siteName: "Tonal Field",
    images: [
      {
        url: "https://tonal-field.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tonal Field - Advanced Color Palette Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tonal Field - Coolors Alternative",
    description: "Generate accessible color palettes with energy-based design. Better control, lower price.",
    images: ["https://tonal-field.vercel.app/og-image.png"],
  },
  verification: {
    google: "WjfSwq-jwgf0c_5rcyxlV_fxb4SHCPpA0s9bpk5IIU4",
  },
  alternates: {
    canonical: "https://tonal-field.vercel.app",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${plexSans.variable} ${spaceGrotesk.variable}`}>
        <AuthProvider>
          <Header />
          <main className="main">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
