
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { BarraNavegacion } from "@/components/nav/BarraNavegacion";
import "./globals.css";

const fuenteGeist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fuenteGeistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Videoteca",
    template: "%s | Videoteca",
  },
  description: "Organiza las películas y series que quieres ver.",
};

export default function LayoutRaiz({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${fuenteGeist.variable} ${fuenteGeistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-fondo text-texto">
        <BarraNavegacion />

        {children}

        <Toaster
          position="top-right"
          richColors
          theme="system"
        />
      </body>
    </html>
  );
}
