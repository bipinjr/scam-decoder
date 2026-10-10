import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { MagneticButtons } from "@/components/fx";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const pen = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-pen" });

export const metadata: Metadata = {
  title: { default: "Scam Decoder", template: "%s · Scam Decoder" },
  description: "Paste a suspicious message, record a call or drop a screenshot. See every trick it uses, in your language. Research-backed scam protection for India.",
};

export const viewport: Viewport = { themeColor: "#060a13" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable} ${pen.variable}`}>
      <body className="min-h-dvh">
        <MagneticButtons />
        <Nav />
        <div className="page-in">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
