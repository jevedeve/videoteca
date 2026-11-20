
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
    default: "Videoteca 2.0 | Tu rincón de cine y series",
    template: "%s | Videoteca 2.0",
  },
  description:
    "Descubre películas y series, organiza lo que quieres ver, guarda tus favoritas y lleva el control de todo lo que has visto en Videoteca 2.0.",
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
