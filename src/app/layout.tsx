import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "@/lib/zod-es" // configura mensajes de error de Zod en español
import "./globals.css"

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "CuidaConnect — Cuidadores para adultos mayores en Chile",
  description:
    "Conectamos familias con cuidadores de confianza en Chile. Encuentra el cuidador ideal para tu ser querido.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="es" className={`${nunito.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col bg-background text-foreground">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
