import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokédex Lite - Explore the World of Pokémon",
  description: "A modern, responsive Pokédex application built with Next.js 15, TypeScript, and Tailwind CSS. Search, filter, and explore your favorite Pokémon with beautiful animations and a great user experience.",
  keywords: ["pokemon", "pokedex", "next.js", "typescript", "react", "tailwind css"],
  authors: [{ name: "Pokédex Lite Team" }],
  openGraph: {
    title: "Pokédex Lite - Explore the World of Pokémon",
    description: "A modern, responsive Pokédex application with search, filters, and favorites.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokédex Lite - Explore the World of Pokémon",
    description: "A modern, responsive Pokédex application with search, filters, and favorites.",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col font-sans"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
