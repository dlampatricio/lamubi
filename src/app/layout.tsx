import { ThemeProvider } from '@/components/ThemeProvider';
import { LangProvider } from '@/hooks/useTranslation';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lamubi.vercel.app'),
  title: {
    default: 'La Mubi — Movies Mimic Experience',
    template: '%s — La Mubi',
  },
  description:
    'Multiplayer movie-charades party game. Act out, guess, and find the impostor in your favorite films.',
  applicationName: 'La Mubi',
  keywords: ['charades', 'movie game', 'impostor', 'party game', 'multiplayer'],
  authors: [{ name: 'David Lam' }],
  creator: 'David Lam',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'La Mubi',
    title: 'La Mubi — Movies Mimic Experience',
    description:
      'Multiplayer movie-charades party game. Act out, guess, and find the impostor in your favorite films.',
    url: 'https://lamubi.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Mubi — Movies Mimic Experience',
    description:
      'Multiplayer movie-charades party game. Act out, guess, and find the impostor in your favorite films.',
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('lamubi-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-surface text-text-primary`}
      >
        <ThemeProvider>
          <LangProvider>
            {children}
            <Analytics />
            <SpeedInsights />
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
