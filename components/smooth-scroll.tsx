"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
    })

    function raf(time: number) {
      lenis.raf(time)
      ScrollTrigger.update()
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    const onRefresh = () => lenis.resize()
    ScrollTrigger.addEventListener("refresh", onRefresh)
    ScrollTrigger.refresh()

    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh)
      lenis.destroy()
    }
  }, [])

  return null
}
