"use client"

import { useEffect, useState } from "react"
import { motion, useAnimation, useReducedMotion } from "framer-motion"
import { Logo } from "./logo"

export default function AnimatedLogo() {
  const controls = useAnimation()
  const reduceMotion = useReducedMotion()
  const [lastScrollY, setLastScrollY] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (reduceMotion) {
      controls.set({ opacity: 1, y: 0, scale: 1 })
      return
    }

    const onScroll = () => {
      const currentY = window.scrollY

      // detect scroll UP
      if (currentY < lastScrollY && currentY > 120) {
        if (!visible) {
          setVisible(true)
          controls.start({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            },
          })
        }
      }

      // scrolling DOWN → hide logo
      if (currentY > lastScrollY && visible) {
        setVisible(false)
        controls.start({
          opacity: 0,
          y: 40,
          scale: 0.95,
          transition: {
            duration: 0.4,
            ease: "easeOut",
          },
        })
      }

      setLastScrollY(currentY)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [lastScrollY, visible, controls, reduceMotion])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={controls}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] pointer-events-none"
    >
      <Logo />
    </motion.div>
  )
}
