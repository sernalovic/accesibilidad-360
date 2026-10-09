import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Accesibilidad 360",
  description:
    "Plataforma web colaborativa para consultar y compartir información sobre accesibilidad de establecimientos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={cn("font-sans", geist.variable)}>
      <body>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-2"
        >
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
