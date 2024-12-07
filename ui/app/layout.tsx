import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const eiko = localFont({
  src: [
    {
      path: "./fonts/Eiko/PPEiko-Thin.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/Eiko/PPEiko-Medium.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Eiko/PPEiko-Heavy.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-eiko",
});

const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
})

export const metadata: Metadata = {
  title: "TuskNet",
  description: "Collaborative Data training platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${eiko.variable} ${satoshi.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
