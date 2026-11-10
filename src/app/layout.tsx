import type { Metadata, Viewport } from "next";
import { Dela_Gothic_One, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const display = Dela_Gothic_One({ variable: "--font-display", weight: "400", subsets: ["latin"], display: "swap" });
const body = Space_Grotesk({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const code = JetBrains_Mono({ variable: "--font-code", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} | ${site.role}`,
  description: site.tagline,
  openGraph: {
    title: `${site.name} | ${site.role}`,
    description: site.tagline,
    url: site.url,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: `${site.name} | ${site.role}`, description: site.tagline },
};

export const viewport: Viewport = {
  themeColor: "#0b0710",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${code.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
