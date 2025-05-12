import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lucas Lelieur · Web Developer",
  icons: {
    icon: "/favicon.png",
  },
  description:
    "Personal portfolio of Lucas Lelieur, a full stack developer focused on building modern and scalable web applications using JavaScript, React, and Node.js. Explore featured projects, technical skills, and contact information.",
  keywords: [
    "Lucas Lelieur",
    "web developer",
    "Ironhack",
    "full stack developer",
    "JavaScript",
    "React",
    "Node.js",
    "Next.js",
    "TypeScript",
    "portfolio",
    "frontend",
    "backend",
    "developer portfolio",
  ],
  openGraph: {
    title: "Lucas Lelieur WebDev Portfolio",
    description: "Explore my personal portfolio.",
    url: "https://tu-dominio.com", // reemplaza con tu URL final
    siteName: "Lucas Lelieur",
    images: [
      {
        url: "https://ruta-a-tu-imagen-de-preview.com/og-image.jpg", // reemplaza
        width: 1200,
        height: 630,
        alt: "Lucas Lelieur Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucas Lelieur WebDev Portfolio",
    description: "Full stack developer portfolio — JavaScript, React, Node.js.",
    images: ["https://ruta-a-tu-imagen-de-preview.com/og-image.jpg"], // reemplaza
    creator: "@lucaslelieur", // si tienes cuenta de Twitter
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased max-w-screen-sm mx-auto w-full px-4 py-12 md:px-0 md:py-16 space-y-24`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
