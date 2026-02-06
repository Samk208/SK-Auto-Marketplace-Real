import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://sk-autosphere.com",
  ),
  title:
    "SK AutoSphere - Korea's Premier Car Marketplace | Buy & Sell Verified Vehicles",
  description:
    "Find your perfect car from 10,000+ verified listings. Buy from trusted dealers or sell to thousands of buyers. Secure payments, buyer protection, and nationwide coverage across Korea.",
  keywords: [
    "car marketplace Korea",
    "buy car Seoul",
    "sell car Korea",
    "verified car dealers",
    "used cars Korea",
    "automotive marketplace",
  ],
  authors: [{ name: "SK AutoSphere" }],
  creator: "SK AutoSphere",
  publisher: "SK AutoSphere",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/?lang=en",
      "ko-KR": "/?lang=ko",
      "fr-FR": "/?lang=fr",
      "sw-KE": "/?lang=sw",
    },
  },
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ko_KR", "fr_FR", "sw_KE"],
    url: "https://skautosphere.com",
    siteName: "SK AutoSphere",
    title: "SK AutoSphere - Korea's Premier Car Marketplace",
    description:
      "Browse 10,000+ verified vehicles from trusted dealers. Secure buying and selling platform with comprehensive buyer protection.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SK AutoSphere - Korea's Premier Car Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SK AutoSphere - Find Your Perfect Car",
    description:
      "Korea's most trusted automotive marketplace with 10,000+ verified listings",
    images: ["/twitter-image.jpg"],
  },
  generator: "v0.dev",
};

import { SiteFooter } from "@/components/site-footer";

import { LanguageProvider } from "@/lib/i18n/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0F172A" />
        <link rel="apple-touch-icon" href="/placeholder-logo.png" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <LanguageProvider>
          {children}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (
                  'serviceWorker' in navigator &&
                  location.hostname !== 'localhost' &&
                  location.hostname !== '127.0.0.1'
                ) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(
                      function(registration) {
                        console.log('[SW] Registration successful:', registration.scope);
                      },
                      function(err) {
                        console.log('[SW] Registration failed:', err);
                      }
                    );
                  });
                }
              `,
            }}
          />
          <SiteFooter />
          <NegotiatorWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}

import { NegotiatorWidget } from "@/components/ai/negotiator-widget";
