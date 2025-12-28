"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"

const images = [
  "https://64.media.tumblr.com/db8472cfbb89a155148003b053d5f3de/4d6d987e0cee7307-8e/s400x225/158142e8e876044a6191733a02f6ee5ac1643b58.gif",
  "https://i.pinimg.com/originals/14/f4/35/14f435eaaf8d107cca5055ce150eaf47.gif",
]

export function AutoSliderBanner() {
  const [index, setIndex] = useState(0)
  const heroRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  /* -----------------------------
     SCROLL-BOUND ANIMATIONS
  ----------------------------- */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  // Ghost background typography motion
  const bigScale = useTransform(scrollYProgress, [0, 1], [0.95, 1.35])
  const bigOpacity = useTransform(scrollYProgress, [0, 0.6], [0.08, 0.18])
  const bigY = useTransform(scrollYProgress, [0, 1], [0, -80])

  /* -----------------------------
     BACKGROUND SLIDER
  ----------------------------- */
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const scrollToProducts = () => {
    document.getElementById("product-section")?.scrollIntoView({
      behavior: "smooth",
    })
  }

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* BACKGROUND IMAGES WITH SMOOTH TRANSITIONS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: [0.83, 0, 0.17, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={images[index]}
            alt="VisionDrop atmosphere"
            fill
            priority
            className="object-cover"
            unoptimized
            sizes="100vw"
            quality={85}
          />
        </motion.div>
      </AnimatePresence>

      {/* GRADIENT OVERLAY FOR CONTRAST */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80 z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.8)_70%)] z-[1]" />

      {/* 🔥 BACKGROUND GHOST TYPOGRAPHY */}
      <motion.div
        style={{
          scale: bigScale,
          opacity: bigOpacity,
          y: bigY,
        }}
        className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none"
      >
        <h1 className="text-[clamp(8rem,15vw,20rem)] font-black tracking-tighter text-white leading-[0.8] select-none opacity-90">
          VISIONDROP
        </h1>
      </motion.div>

      {/* FOREGROUND CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        className="relative z-[3] flex h-full flex-col items-center justify-center text-center px-6"
      >
        {/* REAL LOGO WITH GLOW EFFECT */}
        <div className="relative mb-8">
          <motion.img
            src="/visiondrop-logo.png"
            alt="VisionDrop logo"
            className="w-[clamp(200px,30vw,400px)] h-auto filter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            draggable={false}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <div className="absolute inset-0 w-full h-full bg-white/5 blur-xl -z-10" />
        </div>

        {/* TAGLINE */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl lg:text-3xl text-neutral-300 max-w-2xl mb-12 tracking-wider font-light"
        >
          Premium streetwear inspired by underground culture.
        </motion.p>

        {/* CTA BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <Button
            onClick={scrollToProducts}
            size="lg"
            variant="outline"
            className="group relative border-2 border-white bg-transparent text-white px-12 py-7 rounded-full overflow-hidden transition-all duration-300 hover:bg-white hover:text-black"
          >
            <span className="relative z-10 font-medium tracking-wider">
              Shop the Drop
            </span>
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ originX: 0 }}
            />
          </Button>
        </motion.div>

        {/* SCROLL INDICATOR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[2px] h-12 bg-gradient-to-b from-white/80 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}