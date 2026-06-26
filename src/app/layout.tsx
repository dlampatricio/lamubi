import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LangProvider } from "@/hooks/useTranslation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "La Mubi — Cinema Mimic Experience",
    template: "%s — La Mubi",
  },
  description:
    "Multiplayer movie-charades party game with Letterboxd integration. Act out, guess, and find the impostor in your favorite films.",
  keywords: ["charades", "movie game", "impostor", "party game", "letterboxd", "multiplayer"],
  authors: [{ name: "Patricio Dlamini" }],
  creator: "Patricio Dlamini",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "La Mubi",
    title: "La Mubi — Cinema Mimic Experience",
    description:
      "Multiplayer movie-charades party game with Letterboxd integration. Act out, guess, and find the impostor in your favorite films.",
  },
  twitter: {
    card: "summary_large_image",
    title: "La Mubi — Cinema Mimic Experience",
    description:
      "Multiplayer movie-charades party game with Letterboxd integration. Act out, guess, and find the impostor in your favorite films.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('lamubi-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`
        }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-surface text-text-primary`}>
        <ThemeProvider>
          <LangProvider>
            {children}
            <Analytics />
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}