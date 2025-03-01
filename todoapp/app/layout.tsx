import type React from "react";
import "./globals.css";
import type { Metadata, Viewport } from "next"; // Import Viewport type
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AccentProvider } from "@/context/accent-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskFlow | Advanced Todo Application",
  description: "A modern, feature-rich todo application with smooth animations",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TaskFlow",
  },
};

export const viewport: Viewport = {
  // Create viewport export
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/icon.svg"
        />
        <meta name="msapplication-TileColor" content="#4f46e5" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AccentProvider>{children}</AccentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
