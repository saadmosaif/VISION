"use client"

import { AnimatePresence, motion } from "framer-motion"

export default function AnimatedShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1], // cinematic easing
        }}
        className="relative z-10"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  )
}
