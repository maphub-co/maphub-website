// STYLES
import "./globals.css";

// FONTS
const inter = Inter({ subsets: ["latin"] });

// LIBRARIES
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

// CONFIG
import Mixpanel from "@/components/mixpanel/Mixpanel";

// PROVIDERS
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import SessionProviders from "@/components/providers/SessionProviders";

// CONSTANTS
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.maphub.co";

/*======= METADATA =======*/
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  applicationName: "MapHub.co",
  title: {
    default: "MapHub.co",
    template: "%s - MapHub.co",
  },
  description:
    "Host, share, and explore any geospatial datasets with MapHub.co. A platform for GIS users who need open data, speed, clarity, and seamless collaboration.",
  publisher: "MapHub.co",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        rel: "mask-icon",
        url: "/favicon.svg",
        color: "#020817",
      },
    ],
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "MapHub.co",
    title: "MapHub.co - Host, Share and Explore any Geospatial Data",
    description:
      "Host, share, and explore any geospatial datasets with MapHub.co. A platform for GIS users who need open data, speed, clarity, and seamless collaboration.",
    images: [
      {
        url: `${BASE_URL}/og.jpg`,
        width: 1200,
        height: 630,
        alt: "MapHub.co - The largest collection of maps on the web",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "MapHub.co - Host, Share and Explore any Geospatial Data",
    description:
      "Host, share, and explore any geospatial datasets with MapHub.co. A platform for GIS users who need open data, speed, clarity, and seamless collaboration.",
    creator: "@maphub",
    images: [`${BASE_URL}/twitter.jpg`],
  },
};

/*======= LAYOUT =======*/
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="w-full h-full p-0 m-0 fixed overflow-hidden scrollbar-hide"
    >
      {/* BODY */}
      <body className={`${inter.className} w-full h-full flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <SessionProviders>
              <AuthProvider>{children}</AuthProvider>
            </SessionProviders>
          </ToastProvider>
        </ThemeProvider>

        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
        <Mixpanel />
      </body>
    </html>
  );
}
