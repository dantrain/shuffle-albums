import type { Metadata, Viewport } from "next";
import { appleDeviceSpecsForLaunchImages } from "pwa-asset-generator";
import SuppressConsoleError from "../components/SuppressConsoleError";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Shuffle Albums",
  description: "Shuffle your liked albums on Spotify",
  twitter: {
    card: "summary",
    site: "https://www.shufflealbums.com",
    title: "Shuffle Albums",
    description: "Shuffle your liked albums on Spotify",
    images: "https://www.shufflealbums.com/manifest-icon-192.maskable.png",
    creator: "@danhappysalad",
  },
  openGraph: {
    type: "website",
    title: "Shuffle Albums",
    description: "Shuffle your liked albums on Spotify",
    siteName: "Shuffle Albums",
    url: "https://www.shufflealbums.com",
    images: "https://www.shufflealbums.com/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico?v=2", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  other: Object.fromEntries(
    (
      appleDeviceSpecsForLaunchImages as Array<{
        portrait: { width: number; height: number };
        scaleFactor: number;
      }>
    ).flatMap((spec, i) => [
      [
        `apple-touch-startup-image-portrait-${i}`,
        `<link rel="apple-touch-startup-image" href="apple-splash-${spec.portrait.width}-${spec.portrait.height}.png" media="(device-width: ${spec.portrait.width / spec.scaleFactor}px) and (device-height: ${spec.portrait.height / spec.scaleFactor}px) and (-webkit-device-pixel-ratio: ${spec.scaleFactor}) and (orientation: portrait)" />`,
      ],
      [
        `apple-touch-startup-image-landscape-${i}`,
        `<link rel="apple-touch-startup-image" href="apple-splash-${spec.portrait.width}-${spec.portrait.height}.png" media="(device-width: ${spec.portrait.height / spec.scaleFactor}px) and (device-height: ${spec.portrait.width / spec.scaleFactor}px) and (-webkit-device-pixel-ratio: ${spec.scaleFactor}) and (orientation: landscape)" />`,
      ],
    ]),
  ),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#181818",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="fixed overflow-x-hidden text-white sm:static bg-background min-h-screen">
        <SuppressConsoleError />
        {children}
      </body>
    </html>
  );
}
