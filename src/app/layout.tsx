import "./globals.css";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import { AIBackdrop } from "@/components/AIBackdrop";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata = {
  title: "Social Post Work",
  description: "AI news → social drafts",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport = {
  themeColor: "#f6f6f8",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <AIBackdrop />
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 min-w-0">
            <div className="mx-auto max-w-4xl px-8 py-10">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
