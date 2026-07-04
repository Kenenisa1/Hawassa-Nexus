import type { Metadata } from "next";
import { Bungee, Roboto_Slab, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ConditionalFooter from "@/components/ConditionalFooter";
import { PHProvider } from "./providers";
import { Suspense } from "react";
import Script from "next/script";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/context/LanguageContext";
import AuthProvider from "@/context/AuthProvider";

const bungee = Bungee({
  weight: "400",
  variable: "--font-bungee",
  subsets: ["latin"],
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hawassa Nexus | City Events & Community Hub",
  description: "Hawassa Nexus — the central platform connecting Hawassa's community with city events, hubs, and people.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${robotoSlab.variable} ${bungee.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col bg-black">
        
        <AuthProvider>
          <LanguageProvider>
            <PHProvider>
              <Suspense fallback={<LoadingSpinner />}>
                <Navbar />

                <main className="grow">{children}</main>

                <Toaster
                  theme="dark"
                  position="top-right"
                  toastOptions={{
                    style: {
                      background: "#000",
                      border: "1px solid #18181b",
                      color: "#fff",
                    },
                  }}
                />

                <ConditionalFooter />
              </Suspense>
            </PHProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-sky-500/20 blur-xl animate-pulse" />
        <svg
          className="animate-spin h-10 w-10 text-sky-500 relative"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    </div>
  );
}
