import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { BlockUIProvider } from "@/contexts/BlockUIContext";
import { BlockUI } from "@/components/ui/BlockUI";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-14 Digital - Sistema de Registro Electoral",
  description: "Sistema de Registro Electoral Digital para las elecciones de Cámara de Representantes en Casanare",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <BlockUIProvider>
            {children}
            <BlockUI />
          </BlockUIProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
