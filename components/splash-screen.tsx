"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

const BRAND_SEQUENCE = [
  "V",
  "VI",
  "VIS",
  "VISI",
  "VISIO",
  "VISION",
  "VISIOND",
  "VISIONDR",
  "VISIONDRO",
  "VISIONDROP",
]

export function SplashScreen() {
  const [progress, setProgress] = useState(0)
  const [textStep, setTextStep] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // 🔒 lock scroll during intro
    document.body.style.overflow = "hidden"

    let progressValue = 0
    let textValue = 0

    const interval = setInterval(() => {
      progressValue += 1
      setProgress(progressValue)

      // advance brand text every 10%
      if (progressValue % 10 === 0 && textValue < BRAND_SEQUENCE.length - 1) {
        textValue += 1
        setTextStep(textValue)
      }

      if (progressValue >= 100) {
        clearInterval(interval)

        // small hold so user actually sees 100%
        setTimeout(() => {
          setVisible(false)
          document.body.style.overflow = ""
        }, 800)
      }
    }, 30) // ~3 seconds total

    return () => {
      clearInterval(interval)
      document.body.style.overflow = ""
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-dark-900"
        >
          {/* LOGO */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-48 h-48 mb-10"
          >
            <Image
              src="/visiondrop-logo.png"
              alt="VisionDrop"
              fill
              priority
              className="object-contain"
            />
          </motion.div>

          {/* BRAND TEXT */}
          <motion.div
            key={textStep}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="font-mono tracking-widest text-white mb-6 h-6"
          >
            {BRAND_SEQUENCE[textStep]}
          </motion.div>

          {/* PROGRESS BAR */}
          <div className="w-64 h-[2px] bg-dark-400 overflow-hidden">
            <motion.div
              className="h-full bg-white"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            />
          </div>

          {/* PERCENT */}
          <div className="mt-3 font-mono text-xs text-gray-300">
            {progress}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
