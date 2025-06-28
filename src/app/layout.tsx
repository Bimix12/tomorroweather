import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from "../components/ui/toaster"

const siteUrl = 'https://tomorroweather.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Tomorrow Weather - Accurate, Real-Time Global Forecasts',
    template: `%s | Tomorrow Weather`,
  },
  description: 'Get accurate real-time weather forecasts and a 7-day outlook for any city in the world with Tomorrow Weather. Check temperature, humidity, wind speed, and more instantly.',
  keywords: ['weather', 'forecast', 'weather forecast', '7-day forecast', 'global weather', 'real-time weather', 'weather today', 'temperature', 'humidity', 'wind speed'],
  authors: [{ name: 'Tomorrow Weather', url: siteUrl }],
  creator: 'Tomorrow Weather',
  
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Tomorrow Weather - Accurate, Real-Time Global Forecasts',
    description: 'Get accurate real-time weather forecasts and a 7-day outlook for any city worldwide.',
    siteName: 'Tomorrow Weather',
  },
  
  twitter: {
    card: 'summary',
    title: 'Tomorrow Weather - Accurate, Real-Time Global Forecasts',
    description: 'Get accurate real-time weather forecasts and a 7-day outlook for any city worldwide.',
  },
  
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Tomorrow Weather',
    url: siteUrl,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-V16PDRHV73"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-V16PDRHV73');
          `}
        </Script>
      </body>
    </html>
  );
}
