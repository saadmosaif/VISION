"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { HoodieCard } from "@/components/hoodie-card"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type Category = "all" | "hoodies" | "tshirts" | "shorts" | "accessories"

export default function Lookbook() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const panelsRef = useRef<HTMLDivElement[]>([])
  const [activeCategory, setActiveCategory] = useState<Category>("all")

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      panelsRef.current.forEach((panel, i) => {
        gsap.fromTo(
          panel,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: panel,
              start: "top center+=100",
              end: "bottom center",
              scrub: true,
            },
          }
        )
      })

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: true,
      })
    })

    return () => ctx.revert()
  }, [])

  const products = [
    { id: 1, name: "VisionDrop Essence", price: 149.99, category: "hoodies", image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg", image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg" },
    { id: 2, name: "Underground Collective", price: 154.99, category: "hoodies", image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg", image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg" },
    { id: 3, name: "Rave Culture", price: 159.99, category: "hoodies", image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg", image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg" },
    { id: 4, name: "Limited Drop", price: 199.99, category: "hoodies", image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg", image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg" },
    { id: 5, name: "Movement Tee", price: 49.99, category: "tshirts", image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg", image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg" },
    { id: 6, name: "Underground Crown", price: 54.99, category: "tshirts", image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg", image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg" },
    { id: 7, name: "Rave Shorts", price: 79.99, category: "shorts", image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg", image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg" },
    { id: 8, name: "Street Shorts", price: 84.99, category: "shorts", image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg", image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg" },
    { id: 9, name: "VisionDrop Ashtray", price: 24.99, category: "accessories", image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg", image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg" },
    { id: 10, name: "Movement Stickers Pack", price: 9.99, category: "accessories", image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg", image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg" },
    { id: 11, name: "Underground Cap", price: 34.99, category: "accessories", image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg", image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg" },
  ]

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory)

  return (
    <main className="bg-neutral-950 text-white">
      {/* PINNED STORY */}
      <section
        ref={containerRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-900 to-black opacity-80" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-32">
          {[
            {
              title: "THE UNDERGROUND",
              text: "Born from rebellion, built for expression.",
            },
            {
              title: "RAW IDENTITY",
              text: "Every piece carries a signal, not a logo.",
            },
            {
              title: "CULTURE FIRST",
              text: "Streetwear as language, not trend.",
            },
          ].map((item, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) panelsRef.current[i] = el
              }}
              className="opacity-0"
            >
              <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
                {item.title}
              </h2>
              <p className="text-xl md:text-2xl text-neutral-300">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="w-full py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-4xl font-bold text-center mb-12">
            Explore the Collection
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filtered.map((p) => (
              <HoodieCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
