import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f5f6" },
    { media: "(prefers-color-scheme: dark)", color: "#111315" },
  ],
};

// Absolute base for the preview-image URLs: an explicit site URL if set, else Vercel's production domain
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Vunguturi Residence | OneMarK",
  description:
    "Design options, construction stages in 3D, and drawings for the Vunguturi Residence, Katheruvu. Prepared by OneMarK.",
  authors: [{ name: "OneMarK Digital", url: "https://onemark.co.in" }],
  creator: "OneMarK",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  openGraph: {
    title: "Vunguturi Residence",
    description:
      "Design options, construction stages in 3D, and drawings. Prepared by OneMarK.",
    siteName: "OneMarK",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vunguturi Residence",
    description: "Design options, construction stages in 3D, and drawings. Prepared by OneMarK.",
  },
  icons: {
    icon: "/OM-Sintry-White.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
