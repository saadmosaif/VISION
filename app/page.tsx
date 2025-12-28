"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { HoodieCard } from "@/components/hoodie-card"
import { AutoSliderBanner } from "@/components/auto-slider-banner"

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isHorizontalComplete, setIsHorizontalComplete] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollProgressRef = useRef<HTMLDivElement>(null)
  
  const hoodies = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    name: `VisionDrop ${i + 1}`,
    price: 199.99,
    image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
    image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg",
  }))

  const sectionRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const manifestRef = useRef<HTMLDivElement | null>(null)
  const scrubTween = useRef<GSAPTween | null>(null)
  const visualManifestoRef = useRef<HTMLDivElement | null>(null)
  const spacerRef = useRef<HTMLDivElement | null>(null)

  const { scrollYProgress } = useScroll()
  
  const horizontalProgress = useTransform(scrollYProgress, [0, 0.8], [0, 100])
  const horizontalOpacity = useTransform(scrollYProgress, [0.3, 0.4, 0.75, 0.8], [0, 1, 1, 0])

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout
    
    const handleScroll = () => {
      setIsScrolling(true)
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => setIsScrolling(false), 100)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return

    const ctx = gsap.context(() => {
      const track = trackRef.current!
      const slides = gsap.utils.toArray<HTMLElement>(".hoodie-slide")
      const section = sectionRef.current!
      const spacer = spacerRef.current!
      
      const horizontalTravelDistance = 4536
      const verticalScrollDistance = 9072
      
      scrubTween.current = gsap.to(track, {
        x: () => -horizontalTravelDistance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${verticalScrollDistance + 1000}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const trackX = Math.abs(parseFloat(track.style.transform.match(/-?\d+/)?.[0] || "0"))
            const horizontalProgress = Math.min(trackX / horizontalTravelDistance, 1)
            const slideIndex = Math.min(Math.floor(horizontalProgress * slides.length), slides.length - 1)
            
            setActiveSlide(slideIndex)
            
            if (horizontalProgress >= 0.98) {
              setIsHorizontalComplete(true)
            } else {
              setIsHorizontalComplete(false)
            }
            
            slides.forEach((slide, i) => {
              const distance = Math.abs(i - slideIndex)
              const opacity = Math.max(0.3, 1 - distance * 0.3)
              const scale = i === slideIndex ? 1.1 : 0.95
              
              gsap.to(slide, {
                opacity: opacity,
                scale: scale,
                duration: 0.3,
              })
            })
          },
          onLeave: () => {
            setIsHorizontalComplete(true)
          }
        },
      })

      gsap.to(".drops-title-container", {
        opacity: 0,
        y: -80,
        scrollTrigger: {
          trigger: section,
          start: "top top+=100",
          end: () => `top+=${verticalScrollDistance * 0.4}`,
          scrub: 1.5,
        },
      })

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${verticalScrollDistance + 1000}`,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: () => {
          const viewportCenter = window.innerWidth / 2
          const maxDistance = window.innerWidth / 2.5

          slides.forEach((slide, i) => {
            const rect = slide.getBoundingClientRect()
            const slideCenter = rect.left + rect.width / 2
            const distance = Math.abs(viewportCenter - slideCenter)
            const progress = Math.min(distance / maxDistance, 1)

            const scale = gsap.utils.interpolate(1.15, 0.85, progress)
            const opacity = gsap.utils.interpolate(1, 0.4, progress)
            
            gsap.to(slide, {
              scale: scale,
              opacity: opacity,
              duration: 0.3,
            })
          })
        },
      })
      
      gsap.set(spacer, {
        height: verticalScrollDistance + "px"
      })
      
      if (visualManifestoRef.current) {
        gsap.set(visualManifestoRef.current, {
          opacity: 0,
          y: 50
        })
        
        ScrollTrigger.create({
          trigger: spacer,
          start: "top bottom",
          end: "bottom bottom",
          onEnter: () => {
            gsap.to(visualManifestoRef.current, {
              opacity: 1,
              y: 0,
              duration: 1.5,
              ease: "power2.out"
            })
          },
          onLeaveBack: () => {
            gsap.to(visualManifestoRef.current, {
              opacity: 0,
              y: 50,
              duration: 0.5
            })
          }
        })
      }
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh()
    }
    
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <main className="flex flex-col bg-black text-white overflow-x-hidden relative">
      {/* ENHANCED CURSOR EFFECT */}
      
      
      {/* ANIMATED BACKGROUND PARTICLES */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-purple-900/20 opacity-30" />
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1px] h-[1px] bg-white/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <AutoSliderBanner />

      {/* ENHANCED SCROLL PROGRESS INDICATOR */}
      <motion.div
        ref={scrollProgressRef}
        style={{
          width: horizontalProgress,
          opacity: horizontalOpacity,
        }}
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-white via-purple-400 to-white z-50 origin-left shadow-[0_0_20px_rgba(255,255,255,0.3)]"
      />

      {/* GLOWING MANIFESTO SECTION */}
      <motion.section
        ref={manifestRef}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.83, 0, 0.17, 1] }}
        className="relative py-40 border-t border-white/10 bg-gradient-to-b from-black via-purple-900/10 to-black overflow-hidden"
      >
        {/* ANIMATED GRID BACKGROUND */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,white_50%,transparent_51%)] bg-[length:60px_60px] animate-gridMove" />
          <div className="absolute inset-0 bg-[linear-gradient(transparent_49%,white_50%,transparent_51%)] bg-[length:60px_60px] animate-gridMove" />
        </div>

        {/* PULSING GLOW EFFECTS */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/10 blur-3xl rounded-full"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 blur-3xl rounded-full"
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-6 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            <p className="font-mono text-white/60 tracking-widest text-sm">
              VISIONDROP MANIFESTO
            </p>
            <div className="w-6 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
          >
            We Are The
            <br />
            <span className="relative">
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Underground
              </span>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-4 bg-gradient-to-r from-white/0 via-white/20 to-white/0 blur-xl"
              />
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-neutral-300 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            VisionDrop is not clothing. It's a signal — rebellion,
            culture, identity for those who see beyond the surface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/about"
              className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/20 hover:border-white transition-all duration-300 overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="font-medium tracking-wider relative">Read Our Story</span>
              <motion.span
                className="relative"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ENHANCED GRID PREVIEW */}
      <section className="relative py-40 border-t border-white/10 bg-black overflow-hidden">
        {/* BACKGROUND TEXTURE */}
        <div className="absolute inset-0 noise-texture opacity-5" />
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6 relative"
        >
          <div className="text-center mb-20">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "200px" }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8"
            />
            <p className="font-mono text-white/60 mb-4 tracking-widest text-sm">
              FEATURED COLLECTION
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Latest Releases
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {hoodies.slice(0, 4).map((hoodie, i) => (
              <motion.div
                key={hoodie.id}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: i * 0.08,
                  duration: 0.6,
                  ease: "easeOut"
                }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-purple-500/10 to-white/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <HoodieCard {...hoodie} />
              </motion.div>
            ))}
          </div>

          {/* VIEW ALL LINK */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 text-white/60 hover:text-white transition-colors group"
            >
              <span className="font-mono text-sm tracking-wider">VIEW ALL PRODUCTS</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-lg"
              >
                →
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* HORIZONTAL SCROLL SECTION WITH ENHANCED EFFECTS */}
      <section
        ref={sectionRef}
        className="relative bg-gradient-to-b from-black via-purple-900/5 to-black border-t border-white/10 overflow-hidden"
      >
        {/* AMBIENT PARTICLES */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[1px] h-[1px] bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
              }}
            />
          ))}
        </div>

        {/* COMPLETION OVERLAY */}
        <AnimatePresence>
          {isHorizontalComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-b from-transparent via-black/30 to-transparent"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200,
                    damping: 15
                  }}
                  className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm"
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl"
                  >
                    ✦
                  </motion.span>
                </motion.div>
                <p className="font-mono text-sm text-white/60 tracking-wider">
                  All {hoodies.length} drops viewed
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ENHANCED SLIDE COUNTER */}
        <div className="fixed bottom-8 left-8 z-30 flex items-center gap-3 backdrop-blur-sm bg-black/30 px-4 py-3 rounded-full border border-white/10">
          <div className="flex items-center gap-2">
            {hoodies.map((_, i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeSlide ? "bg-white scale-125" : "bg-white/30"
                }`}
                animate={i === activeSlide ? {
                  boxShadow: ["0 0 0px rgba(255,255,255,0.5)", "0 0 10px rgba(255,255,255,0.8)"]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
            ))}
          </div>
          <div className="ml-4 font-mono text-sm text-white/60">
            {Math.min(activeSlide + 1, hoodies.length)} / {hoodies.length}
          </div>
        </div>

        {/* ENHANCED SCROLL PROGRESS BAR */}
        <div className="fixed bottom-8 right-8 z-30 w-32 backdrop-blur-sm bg-black/30 p-4 rounded-full border border-white/10">
          <div className="relative">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-white via-purple-200 to-white"
                initial={{ width: "0%" }}
                animate={{ 
                  width: `${Math.min(((activeSlide + 1) / hoodies.length) * 100, 100)}%` 
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
              </motion.div>
            </div>
            <div className="text-center font-mono text-xs text-white/60 mt-2">
              {Math.min(Math.round(((activeSlide + 1) / hoodies.length) * 100), 100)}%
            </div>
          </div>
        </div>

        <div className="h-screen overflow-visible relative">
          {/* SCROLL HINT */}
          <motion.div
            animate={{ opacity: isScrolling ? 0 : [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          >
            <div className="flex items-center gap-2 text-white/40 font-mono text-sm">
              <span>SCROLL</span>
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </div>
          </motion.div>

          {/* TITLE */}
          <div className="drops-title-container absolute top-20 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-4" />
              <p className="font-mono text-white/60 tracking-widest text-sm">
                HORIZONTAL SCROLL
              </p>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              Current Drops
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-sm font-mono"
            >
              {isHorizontalComplete 
                ? "✓ Complete - Scroll down to continue" 
                : `Scroll to explore ${hoodies.length} drops →`
              }
            </motion.p>
          </div>

          {/* TRACK */}
          <div
            ref={trackRef}
            className="absolute inset-0 flex items-center gap-24 px-[20vw] will-change-transform"
            style={{ width: "max-content" }}
          >
            {hoodies.map((hoodie, i) => (
              <motion.div
                key={hoodie.id}
                className="hoodie-slide min-w-[400px] flex-shrink-0 opacity-40 scale-95"
                data-index={i}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-white/0 via-white/10 to-white/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <HoodieCard {...hoodie} />
                </div>
              </motion.div>
            ))}
            
            {/* END MARKER */}
            <motion.div 
              className="min-w-[400px] flex items-center justify-center opacity-20"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="text-center">
                <div className="text-6xl font-bold mb-4">✧</div>
                <p className="font-mono text-sm">End of Collection</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div ref={spacerRef} className="h-0" />

      {/* VISUAL MANIFESTO */}
      <section
        ref={visualManifestoRef}
        className="relative bg-black overflow-hidden border-t border-white/10"
        style={{ opacity: 0 }}
      >
        {/* ANIMATED GRADIENT LINE */}
        <div className="absolute top-0 left-0 right-0 h-px">
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-white to-transparent"
            animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-24"
          >
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-8 h-px bg-white/40" />
              <p className="font-mono text-white/60 tracking-widest text-sm">
                BEYOND THE SCROLL
              </p>
              <div className="w-8 h-px bg-white/40" />
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              The Vision
              <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-white via-white/80 to-white bg-clip-text text-transparent">
                  Unfolds
                </span>
                <div className="absolute -inset-4 bg-gradient-to-r from-white/0 via-white/20 to-white/0 blur-xl opacity-50" />
              </span>
            </h2>
            
            <AnimatePresence>
              {isHorizontalComplete && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-white/40 font-mono text-sm mt-8"
                >
                  Having seen all {hoodies.length} drops, now discover what drives VisionDrop
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ENHANCED CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
            {[
              {
                number: "01",
                title: "Rooted in Culture",
                description: "VisionDrop emerges from the underground — where music, art, and rebellion collide. Each piece tells a story of resistance and authenticity.",
                tags: ["Street", "Art", "Music"]
              },
              {
                number: "02",
                title: "Craftsmanship",
                description: "Premium materials meet meticulous design. Every stitch, every detail is intentional — built to last and designed to disrupt.",
                tags: ["Quality", "Detail", "Precision"]
              },
              {
                number: "03",
                title: "Community First",
                description: "More than clothing — a movement. Join a global network of creators, thinkers, and rebels pushing boundaries together.",
                tags: ["Unity", "Creativity", "Movement"]
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative group"
              >
                <div className="relative p-8 rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent hover:from-white/10 transition-all duration-500">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/0 via-purple-500/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="text-6xl font-bold text-white/10 mb-6">{item.number}</div>
                    <h3 className="text-2xl font-bold mb-6 tracking-tight">{item.title}</h3>
                    <p className="text-white/60 leading-relaxed mb-8">{item.description}</p>
                    
                    <div className="pt-8 border-t border-white/10">
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-sm font-mono border border-white/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FULL-WIDTH STATEMENT */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="relative py-20 my-20 overflow-hidden"
          >
            {/* ANIMATED BACKGROUND */}
            <div className="absolute inset-0 border-y border-white/10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            </div>

            {/* MARQUEE TEXT */}
            <div className="absolute inset-0 flex items-center overflow-hidden opacity-10">
              <motion.div
                animate={{ x: [0, -1000] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="flex whitespace-nowrap"
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className="text-6xl md:text-8xl font-bold text-white mx-12">
                    VISIONDROP ·
                  </span>
                ))}
              </motion.div>
            </div>

            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border border-white/20 rounded-full mx-auto mb-8 flex items-center justify-center"
              >
                <span className="text-2xl">"</span>
              </motion.div>
              
              <p className="text-2xl md:text-4xl font-bold mb-8 leading-relaxed">
                "We don't follow trends — we create movements from the ground up."
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <span className="text-white/60 font-mono text-sm">Founder's Note</span>
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
            </div>
          </motion.div>

          {/* INTERACTIVE CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <Link
              href="/movement"
              className="group relative inline-flex items-center gap-8 px-12 py-6 rounded-full border border-white/20 bg-gradient-to-r from-white/10 to-transparent hover:border-white transition-all duration-500 overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8 }}
              />
              
              <div className="relative flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-white"
                />
                <motion.div
                  animate={{ scale: [1.2, 1, 1.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-white"
                />
              </div>
              
              <span className="text-xl font-medium tracking-wider relative">
                Join The Movement
              </span>
              
              <div className="relative flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1.2, 1, 1.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-white"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-white"
                />
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* POST-HORIZONTAL CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative py-40 border-t border-white/10 text-center bg-black overflow-hidden"
      >
        {/* BACKGROUND EFFECT */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />
        
        <div className="relative max-w-2xl mx-auto px-6">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            You've Seen {hoodies.length} Drops
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 mb-10"
          >
            Now explore the full collection and join the movement
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/shop"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-white text-black hover:bg-white/90 transition-all duration-300 overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-black/5 to-white/0"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="font-medium tracking-wider relative">
                View All {hoodies.length} Items
              </span>
              <motion.span
                className="relative"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Link>
            
            <Link
              href="/about"
              className="group inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full border border-white/20 hover:border-white transition-all duration-300"
            >
              <span className="font-medium tracking-wider">Learn More</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </main>
  )
}