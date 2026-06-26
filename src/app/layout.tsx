import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import { LangProvider } from "@/hooks/useTranslation";
import LanguageToggle from "@/components/LanguageToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La Mubi",
  description: "Cinema Mimic Experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-surface text-text-primary`}>
        <ThemeProvider>
          <LangProvider>
            <ThemeToggle />
            <LanguageToggle />
            {children}
            <Analytics />
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}