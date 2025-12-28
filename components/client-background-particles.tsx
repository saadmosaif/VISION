"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"

export function ClientBackgroundParticles() {
  useEffect(() => {
    // This only runs on client
    console.log("Background particles mounted on client")
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-purple-900/20 opacity-30" />
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[1px] h-[1px] bg-white/30 rounded-full"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
          }}
          animate={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}