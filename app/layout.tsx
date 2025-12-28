import "./globals.css"
import type { Metadata } from "next"
import type React from "react"
import { Inter } from "next/font/google"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VisionDrop — Premium Streetwear",
  description: "Culture-driven streetwear inspired by underground movements",
  openGraph: {
    title: "VisionDrop — Premium Streetwear",
    description: "Culture-driven streetwear inspired by underground movements",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "VisionDrop — Premium Streetwear",
    description: "Culture-driven streetwear inspired by underground movements",
    images: ["/og-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {children}
        <Footer />
      </body>
    </html>
  )
}