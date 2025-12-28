"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { motion, useScroll, useTransform, AnimatePresence, useVelocity, useMotionValue, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const videos = [
  "/hero-video-1.mp4",
  "/hero-video-2.mp4"
]

export function HeroParallax() {
  const [index, setIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const videoElementsRef = useRef<HTMLVideoElement[]>([])
  
  const shouldReduceMotion = useReducedMotion()
  
  // Use MotionValues for mouse tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Pre-generate random values (OPTIMIZED COUNTS)
  const DRIP_CONFIGS = useMemo(() => 
    Array.from({ length: 8 }).map(() => ({ // Reduced from 12 to 8
      width: Math.random() * 2 + 1, // Reduced from 3+1 to 2+1
      height: Math.random() * 30 + 20, // Reduced from 40+30 to 30+20
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      left: 5 + Math.random() * 7.5
    }))
  , [])
  
  const PARTICLE_CONFIGS = useMemo(() => ({
    large: Array.from({ length: 5 }).map(() => ({ // Reduced from 8 to 5
      size: Math.random() * 3 + 1, // Reduced from 4+2 to 3+1
      duration: Math.random() * 10 + 5, // Reduced from 15+10 to 10+5
      delay: Math.random() * 3,
      x: (Math.random() - 0.5) * 150, // Reduced from 200 to 150
      y: -100 - Math.random() * 50 // Reduced from -150 to -100
    })),
    
    small: Array.from({ length: 15 }).map(() => ({ // Reduced from 25 to 15
      size: Math.random() * 1.5 + 0.5, // Reduced from 2+0.5 to 1.5+0.5
      duration: Math.random() * 6 + 3, // Reduced from 8+4 to 6+3
      delay: Math.random() * 2,
      x: (Math.random() - 0.5) * 20, // Reduced from 30 to 20
      y: -30 - Math.random() * 30 // Reduced from -50 to -30
    })),
    
    glow: Array.from({ length: 2 }).map((_, i) => ({ // Reduced from 3 to 2
      left: 25 + i * 40,
      top: 35 + i * 25,
      duration: 3 + i
    }))
  }), [])
  
  // Scroll tracking for parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  // Velocity-based effects
  const scrollVelocity = useVelocity(scrollYProgress)
  const velocityIntensity = useTransform(
    scrollVelocity,
    [-1000, 0, 1000],
    [0.5, 0, 0.5] // Reduced max intensity from 1 to 0.5
  )
  
  // Parallax transforms
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]) // Reduced from 10%
  const graffitiY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]) // Reduced from 20%
  const graffitiOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0, 0.5, 0.5, 0]) // Reduced opacity
  const logoScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]) // Reduced from 1.1
  const logoY = useTransform(scrollYProgress, [0, 1], ["0%", "2%"]) // Reduced from 3%
  
  // Dynamic parallax with velocity
  const dynamicVideoY = useTransform(
    [videoY, velocityIntensity],
    ([videoYVal, intensityVal]: number[]) => {
      const base = parseFloat(videoYVal.toString())
      const intensity = Math.min(intensityVal, 0.2) // Reduced from 0.3
      return `${base + intensity}%`
    }
  )
  
  const dynamicGraffitiY = useTransform(
    [graffitiY, velocityIntensity],
    ([graffitiYVal, intensityVal]: number[]) => {
      const base = parseFloat(graffitiYVal.toString())
      const intensity = Math.min(intensityVal, 0.3) // Reduced from 0.5
      return `${base + intensity}%`
    }
  )
  
  // Mouse tracking
  useEffect(() => {
    if (shouldReduceMotion) return
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 10) // Reduced from 15
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 8) // Reduced from 10
    }
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY, shouldReduceMotion])
  
  // Video auto-slider
  useEffect(() => {
    if (shouldReduceMotion) return
    
    const timer = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setIndex(prev => (prev + 1) % videos.length)
        setIsTransitioning(false)
      }, 300)
    }, 6000)
    
    return () => clearInterval(timer)
  }, [shouldReduceMotion])
  
  // Video management
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Play current video
    const currentVideo = videoElementsRef.current[index]
    if (currentVideo) {
      currentVideo.currentTime = 0
      currentVideo.play().catch(console.error)
    }
  }, [index])
  
  const scrollToProducts = useCallback(() => {
    const element = document.getElementById("product-section")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  // Early return for reduced motion
  if (shouldReduceMotion) {
    return (
      <section className="relative w-full h-screen bg-black">
        <video
          src={videos[0]}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
          <Image
            src="/visiondrop-logo.png"
            alt="VisionDrop"
            width={400}
            height={200}
            className="w-[clamp(200px,30vw,400px)] h-auto mb-8"
            priority
          />
          <p className="text-xl md:text-2xl lg:text-3xl text-neutral-300 max-w-2xl mb-12">
            Premium streetwear inspired by underground culture.
          </p>
          <Button
            onClick={scrollToProducts}
            size="lg"
            variant="outline"
            className="border-2 border-white bg-transparent text-white px-12 py-7"
          >
            Shop the Drop
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* LAYER 1: VIDEO BACKGROUND */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          y: dynamicVideoY,
          x: useTransform(mouseX, x => x * 0.3), // Reduced from 0.5
          rotateZ: useTransform(mouseX, x => x * 0.005) // Reduced from 0.01
        }}
      >
        {/* Dual video elements */}
        {videos.map((src, i) => (
          <motion.video
            key={src}
            ref={el => {
              if (el) videoElementsRef.current[i] = el
            }}
            src={src}
            autoPlay={i === 0}
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: i === 0 ? 1 : 0 }}
            animate={{ 
              opacity: i === index ? 1 : 0,
              scale: i === index ? 1 : 1.03 // Reduced from 1.05
            }}
            transition={{ 
              duration: 1,
              ease: [0.83, 0, 0.17, 1]
            }}
          />
        ))}
        
        {/* Glitch overlay */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }} // Reduced from 0.4
              exit={{ opacity: 0 }}
              className="absolute inset-0 mix-blend-overlay"
              style={{
                background: `
                  linear-gradient(45deg, 
                    transparent 45%, 
                    rgba(255, 0, 255, 0.2) 50%, 
                    transparent 55%
                  )`,
                backgroundSize: '80px 80px', // Reduced from 100px
              }}
            />
          )}
        </AnimatePresence>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.8)_100%)]" />
      </motion.div>
      
      {/* LAYER 2: GRAFFITI TEXT */}
      <motion.div
        className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none"
        style={{
          y: dynamicGraffitiY,
          opacity: graffitiOpacity,
          x: useTransform(mouseX, x => x * 0.2), // Reduced from 0.3
          rotateZ: useTransform(mouseX, x => x * 0.003) // Reduced from 0.005
        }}
      >
        <div className="relative">
          <h1 className="text-[clamp(5rem,10vw,14rem)] font-black tracking-tighter text-white leading-[0.8] select-none relative">
            VISIONDROP
            
            {/* Drips */}
            {DRIP_CONFIGS.map((config, i) => (
              <div
                key={i}
                className="absolute bg-gradient-to-b from-white/50 via-white/20 to-transparent rounded-b-full"
                style={{
                  width: `${config.width}px`,
                  left: `${config.left}%`,
                  top: "100%",
                  height: `${config.height}px`,
                  transformOrigin: "top center",
                  animation: `drip ${config.duration}s ease-in-out ${config.delay}s infinite`
                }}
              />
            ))}
          </h1>
          
          {/* Graffiti texture */}
          <div className="absolute inset-0 mix-blend-overlay opacity-30"
            style={{
              background: `
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 3px,
                  rgba(255,255,255,0.08) 3px,
                  rgba(255,255,255,0.08) 6px
                )`,
              backgroundSize: '150px 150px', // Reduced from 200px
            }}
          />
        </div>
      </motion.div>
      
      {/* LAYER 3: FOREGROUND CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        className="relative z-[3] flex h-full flex-col items-center justify-center text-center px-6"
        style={{
          y: logoY,
          scale: logoScale,
          x: useTransform(mouseX, x => x * 0.15) // Reduced from 0.2
        }}
      >
        {/* Logo */}
        <div className="relative mb-8">
          <Image
            src="/visiondrop-logo.png"
            alt="VisionDrop"
            width={400}
            height={200}
            className="w-[clamp(180px,28vw,380px)] h-auto filter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]" // Reduced glow
            priority
          />
          
          {/* Glow effects */}
          <div className="absolute inset-0 w-full h-full -z-10"
            style={{
              background: "radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)",
              filter: "blur(30px)", // Reduced from 40px
              animation: "pulse-slow 3s ease-in-out infinite"
            }}
          />
        </div>

        {/* Tagline */}
        <div className="relative">
          <p className="text-xl md:text-2xl lg:text-3xl text-neutral-300 max-w-2xl mb-12 tracking-wider font-light">
            Premium streetwear inspired by underground culture.
          </p>
          <motion.div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-white to-transparent"
            initial={{ width: 0 }}
            animate={{ width: "160px" }} // Reduced from 200px
            transition={{ delay: 1, duration: 1, ease: "easeOut" }}
          />
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <Button
            onClick={scrollToProducts}
            size="lg"
            variant="outline"
            className="group relative border-2 border-white/30 bg-transparent text-white px-10 py-6 rounded-full overflow-hidden hover:border-white hover:bg-white/5"
          >
            <span className="relative z-10 font-medium tracking-wider flex items-center gap-3">
              Shop the Drop
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
            <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-[1px] h-20 bg-gradient-to-b from-white via-purple-400/30 to-transparent relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white animate-pulse" />
          </div>
          <div className="mt-4 flex items-center gap-3 text-white/60">
            <span className="text-xs font-mono tracking-[0.2em]">SCROLL</span>
            <span className="animate-bounce text-sm">↓</span>
          </div>
        </div>
      </motion.div>
      
      {/* PARTICLE SYSTEM (OPTIMIZED) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large particles */}
        {PARTICLE_CONFIGS.large.map((config, i) => (
          <div
            key={`large-${i}`}
            className="absolute rounded-full bg-gradient-to-r from-white/30 to-white/5"
            style={{
              width: `${config.size}px`,
              height: `${config.size}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: "blur(0.5px)", // Reduced from 1px
              boxShadow: "0 0 5px rgba(255,255,255,0.2)", // Reduced from 10px
              animation: `float-large ${config.duration}s linear ${config.delay}s infinite`,
              '--x': `${config.x}px`,
              '--y': `${config.y}px`
            } as React.CSSProperties}
          />
        ))}
        
        {/* Small particles */}
        {PARTICLE_CONFIGS.small.map((config, i) => (
          <div
            key={`small-${i}`}
            className="absolute rounded-full bg-white/15"
            style={{
              width: `${config.size}px`,
              height: `${config.size}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-small ${config.duration}s linear ${config.delay}s infinite`,
              '--x': `${config.x}px`,
              '--y': `${config.y}px`
            } as React.CSSProperties}
          />
        ))}
        
        {/* Glow particles */}
        {PARTICLE_CONFIGS.glow.map((config, i) => (
          <div
            key={`glow-${i}`}
            className="absolute rounded-full"
            style={{
              width: "80px", // Reduced from 100px
              height: "80px",
              left: `${config.left}%`,
              top: `${config.top}%`,
              background: "radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, transparent 70%)",
              filter: "blur(15px)", // Reduced from 20px
              animation: `pulse-slow ${config.duration}s ease-in-out infinite`
            }}
          />
        ))}
      </div>
    </section>
  )
}