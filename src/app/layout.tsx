import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Caveat } from "next/font/google";
import "./globals.css";

const body = Atkinson_Hyperlegible({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-body" });
const pen = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-pen" });

export const metadata: Metadata = {
  title: "Scam Decoder",
  description: "Paste a suspicious message. See every trick it uses, marked up in plain words, in your language.",
};

export const viewport: Viewport = { themeColor: "#EEF2F7" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${pen.variable}`}>
      <body>{children}</body>
    </html>
  );
}
