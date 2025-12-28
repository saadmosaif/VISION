"use client"

import { useEffect, useRef, useState } from "react"

type CursorVariant = "default" | "hover" | "active"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null)

  // raw mouse position (NO STATE)
  const mouse = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })

  // semantic state only
  const [variant, setVariant] = useState<CursorVariant>("default")

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    const down = () => setVariant("active")
    const up = () => setVariant("default")

    window.addEventListener("mousemove", move)
    window.addEventListener("mousedown", down)
    window.addEventListener("mouseup", up)

    const hoverOn = () => setVariant("hover")
    const hoverOff = () => setVariant("default")

    const hoverables = document.querySelectorAll(
      "a, button, [data-cursor='hover']"
    )

    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", hoverOn)
      el.addEventListener("mouseleave", hoverOff)
    })

    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mousedown", down)
      window.removeEventListener("mouseup", up)

      hoverables.forEach((el) => {
        el.removeEventListener("mouseenter", hoverOn)
        el.removeEventListener("mouseleave", hoverOff)
      })
    }
  }, [])

  // RAF loop — no React state updates
  useEffect(() => {
    let rafId: number

    const animate = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.15
      pos.current.y += (mouse.current.y - pos.current.y) * 0.15

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
      }

      rafId = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor cursor-${variant}`}
    />
  )
}
