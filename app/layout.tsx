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
  title: "Tonal Field",
  description: "Explore color as a continuous space",
  verification: {
    google: "WjfSwq-jwgf0c_5rcyxlV_fxb4SHCPpA0s9bpk5IIU4",
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
