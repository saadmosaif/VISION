"use client"

import { useEffect, useRef, useState, useReducer, useMemo, useCallback } from "react"
import Link from "next/link"
import { motion, useVelocity, useScroll, useTransform, AnimatePresence } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { HoodieCard } from "@/components/hoodie-card"
import { HeroParallax } from "@/components/hero-parallax"
import { ClientBackgroundParticles } from "@/components/client-background-particles"

gsap.registerPlugin(ScrollTrigger)

// ===== REDUCER FOR DERIVED STATES =====
type ScrollState = {
  activeSlide: number
  isHorizontalComplete: boolean
  isScrolling: boolean
  scrollIntensity: number
  lastScrollTime: number
  scrollDirection: "left" | "right"
  isLooping: boolean
  lastActiveSlide: number
}

type ScrollAction = 
  | { type: 'SET_ACTIVE_SLIDE'; payload: number }
  | { type: 'SET_HORIZONTAL_COMPLETE'; payload: boolean }
  | { type: 'SET_SCROLLING'; payload: boolean }
  | { type: 'SET_SCROLL_INTENSITY'; payload: number }
  | { type: 'SET_LAST_SCROLL_TIME'; payload: number }
  | { type: 'SET_SCROLL_DIRECTION'; payload: "left" | "right" }
  | { type: 'SET_LOOPING'; payload: boolean }
  | { type: 'UPDATE_SCROLL_STATE'; payload: Partial<ScrollState> }

const scrollReducer = (state: ScrollState, action: ScrollAction): ScrollState => {
  switch (action.type) {
    case 'UPDATE_SCROLL_STATE':
      return { ...state, ...action.payload }
    case 'SET_ACTIVE_SLIDE':
      const direction = action.payload > state.activeSlide ? "right" : "left"
      const isLooping = action.payload >= state.activeSlide && state.scrollDirection === "right"
      return {
        ...state,
        activeSlide: action.payload,
        lastActiveSlide: state.activeSlide,
        scrollDirection: direction,
        isLooping
      }
    default:
      return state
  }
}

const initialState: ScrollState = {
  activeSlide: 0,
  isHorizontalComplete: false,
  isScrolling: false,
  scrollIntensity: 0,
  lastScrollTime: 0,
  scrollDirection: "right",
  isLooping: false,
  lastActiveSlide: 0
}

// ===== CUSTOM HOOKS =====
const useSlideRefs = (count: number) => {
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  
  useEffect(() => {
    slideRefs.current = slideRefs.current.slice(0, count)
  }, [count])
  
  const getSlideRef = (index: number) => (el: HTMLDivElement | null) => {
    slideRefs.current[index] = el
  }
  
  return { slideRefs, getSlideRef }
}

const useAnimationController = () => {
  const animationRef = useRef<number | null>(null)
  const isVisibleRef = useRef(true)
  
  const startAnimation = useCallback((callback: FrameRequestCallback) => {
    if (isVisibleRef.current) {
      animationRef.current = requestAnimationFrame(callback)
    }
  }, [])
  
  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [])
  
  const setVisibility = useCallback((visible: boolean) => {
    isVisibleRef.current = visible
    if (!visible) stopAnimation()
  }, [stopAnimation])
  
  useEffect(() => {
    return () => stopAnimation()
  }, [stopAnimation])
  
  return { startAnimation, stopAnimation, setVisibility }
}

export default function Home() {
  // ===== STATE MANAGEMENT =====
  const [scrollState, dispatch] = useReducer(scrollReducer, initialState)
  const {
    activeSlide,
    isHorizontalComplete,
    scrollIntensity,
    scrollDirection,
    isLooping
  } = scrollState

  // ===== REFS =====
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const manifestRef = useRef<HTMLDivElement>(null)
  const visualManifestoRef = useRef<HTMLDivElement>(null)
  const spacerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrubTweenRef = useRef<gsap.core.Tween | null>(null)
  const scrollTimeoutRef = useRef<number | null>(null)
  const scrollVelocityRef = useRef<number>(0)
  const lastUpdateRef = useRef<number>(0)

  // ===== SLIDE REFERENCES =====
  const hoodies = useMemo(() => 
    Array.from({ length: 12 }).map((_, i) => ({
      id: i + 1,
      name: `VisionDrop ${i + 1}`,
      price: 199.99,
      image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
      image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg",
    })), []
  )

  const { slideRefs, getSlideRef } = useSlideRefs(hoodies.length * 2)
  
  // ===== ANIMATION CONTROLLER =====
  const animationController = useAnimationController()

  // ===== FRAMER MOTION HOOKS =====
  const { scrollYProgress } = useScroll()
  const scrollVelocity = useVelocity(scrollYProgress)
  
  const horizontalProgress = useTransform(scrollYProgress, [0, 0.8], [0, 100])
  const horizontalOpacity = useTransform(scrollYProgress, [0.3, 0.4, 0.75, 0.8], [0, 1, 1, 0])

  // ===== SCROLL VELOCITY EFFECT =====
  useEffect(() => {
    const unsubscribe = scrollVelocity.on("change", (latest) => {
      const now = Date.now()
      if (now - lastUpdateRef.current < 50) return // Throttle updates
      
      lastUpdateRef.current = now
      const velocity = Math.abs(latest) * 2000
      const intensity = Math.min(velocity / 1000, 1)
      
      scrollVelocityRef.current = velocity
      dispatch({ type: 'UPDATE_SCROLL_STATE', payload: { scrollIntensity: intensity } })
    })
    
    return unsubscribe
  }, [scrollVelocity])

  // ===== INFINITE LOOP =====
  useEffect(() => {
    if (activeSlide >= hoodies.length - 2 && scrollDirection === "right" && !isLooping) {
      dispatch({ type: 'UPDATE_SCROLL_STATE', payload: { isLooping: true } })
      
      if (trackRef.current) {
        gsap.to(trackRef.current, {
          x: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            dispatch({ 
              type: 'UPDATE_SCROLL_STATE', 
              payload: { 
                activeSlide: 0,
                isLooping: false 
              }
            })
          }
        })
      }
    }
  }, [activeSlide, scrollDirection, hoodies.length, isLooping])

  // ===== DISTORTION WAVE EFFECT =====
  const createRippleEffect = useCallback((centerIndex: number) => {
    slideRefs.current.forEach((slide, index) => {
      if (!slide) return
      
      const distance = Math.abs(index % hoodies.length - centerIndex)
      if (distance > 0) {
        const delay = distance * 50
        
        gsap.to(slide, {
          scale: 1.05,
          duration: 0.2,
          delay: delay / 1000,
          yoyo: true,
          repeat: 1,
          ease: "power2.out"
        })
        
        gsap.to(slide, {
          x: (index % hoodies.length < centerIndex ? -10 : 10),
          duration: 0.3,
          delay: delay / 1000,
          yoyo: true,
          repeat: 1,
          ease: "back.out(1.7)"
        })
      }
    })
  }, [hoodies.length])

  // ===== CANVAS DISTORTION EFFECT WITH VISIBILITY CONTROL =====
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let time = 0
    let isActive = true
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    const animate = () => {
      if (!isActive || !ctx) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Create distortion waves based on scroll intensity
      const waveCount = Math.floor(3 + scrollIntensity * 5)
      
      for (let i = 0; i < waveCount; i++) {
        const amplitude = 20 + scrollIntensity * 100
        const frequency = 0.01 + scrollIntensity * 0.05
        const speed = 0.02 + scrollIntensity * 0.1
        
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 + scrollIntensity * 0.1})`
        ctx.lineWidth = 1 + scrollIntensity * 3
        
        for (let x = 0; x < canvas.width; x += 10) {
          const y = canvas.height / 2 + 
            Math.sin(x * frequency + time * speed + i * Math.PI * 2 / waveCount) * amplitude
          ctx.lineTo(x, y)
        }
        
        ctx.stroke()
      }
      
      time += 0.05 + scrollIntensity * 0.2
      animationController.startAnimation(animate)
    }
    
    // Set up IntersectionObserver for visibility control
    const observer = new IntersectionObserver(
      ([entry]) => {
        animationController.setVisibility(entry.isIntersecting)
        if (entry.isIntersecting) {
          isActive = true
          animate()
        } else {
          isActive = false
        }
      },
      { threshold: 0.1 }
    )
    
    observer.observe(canvas)
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      observer.disconnect()
      animationController.stopAnimation()
    }
  }, [scrollIntensity, animationController])

  // ===== SCROLL DETECTION =====
  useEffect(() => {
    const handleScroll = () => {
      dispatch({ type: 'UPDATE_SCROLL_STATE', payload: { isScrolling: true } })
      
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current)
      }
      
      scrollTimeoutRef.current = window.setTimeout(() => {
        dispatch({ type: 'UPDATE_SCROLL_STATE', payload: { isScrolling: false } })
      }, 100)
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // ===== GSAP HORIZONTAL SCROLL =====
  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return

    const ctx = gsap.context(() => {
      const track = trackRef.current!
      const section = sectionRef.current!
      const spacer = spacerRef.current!
      
      const horizontalTravelDistance = 4536
      const verticalScrollDistance = 9072
      
      // Clean up previous tween
      if (scrubTweenRef.current) {
        scrubTweenRef.current.kill()
      }
      
      scrubTweenRef.current = gsap.to(track, {
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
            const progress = self.progress
            const slideIndex = Math.min(Math.floor(progress * hoodies.length), hoodies.length - 1)
            
            // Update active slide without triggering re-render in animation loop
            if (slideIndex !== activeSlide) {
              dispatch({ type: 'SET_ACTIVE_SLIDE', payload: slideIndex })
            }
            
            // Update horizontal completion state
            const isComplete = progress >= 0.98
            if (isComplete !== isHorizontalComplete) {
              dispatch({ type: 'UPDATE_SCROLL_STATE', payload: { isHorizontalComplete: isComplete } })
            }
            
            // Update slide styles using refs
            slideRefs.current.forEach((slide, i) => {
              if (!slide) return
              
              const adjustedIndex = i % hoodies.length
              const distance = Math.abs(adjustedIndex - slideIndex)
              const opacity = Math.max(0.3, 1 - distance * 0.3)
              const scale = adjustedIndex === slideIndex ? 1.1 : 0.95
              
              gsap.to(slide, {
                opacity: opacity,
                scale: scale,
                duration: 0.3,
                overwrite: true
              })
            })
          },
          onLeave: () => {
            dispatch({ type: 'UPDATE_SCROLL_STATE', payload: { isHorizontalComplete: true } })
          }
        },
      })

      // Title fade out animation
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

      // Center-based scaling animation
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${verticalScrollDistance + 1000}`,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: () => {
          const viewportCenter = window.innerWidth / 2
          const maxDistance = window.innerWidth / 2.5

          slideRefs.current.forEach((slide, i) => {
            if (!slide) return
            
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
              overwrite: true
            })
          })
        },
      })
      
      // Set spacer height
      gsap.set(spacer, {
        height: verticalScrollDistance + "px"
      })
      
      // Visual manifesto animation
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

    return () => {
      ctx.revert()
      if (scrubTweenRef.current) {
        scrubTweenRef.current.kill()
      }
    }
  }, [hoodies.length]) // Only depend on hoodies.length

  // ===== RESIZE HANDLER =====
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh()
    }
    
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <main className="flex flex-col bg-black text-white overflow-x-hidden relative">
      {/* ANIMATED BACKGROUND PARTICLES */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <ClientBackgroundParticles />
      </div>

      <HeroParallax />
      
      {/* ENHANCED SCROLL PROGRESS INDICATOR */}
      <motion.div
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

      {/* ULTIMATE HORIZONTAL SCROLL EXPERIENCE */}
      <section
        ref={sectionRef}
        className="relative bg-gradient-to-b from-black via-black/95 to-black border-t border-white/10 overflow-hidden"
      >
        {/* GLOBAL DISTORTION CANVAS */}
        <canvas 
          ref={canvasRef}
          id="distortion-canvas"
          className="absolute inset-0 z-10 pointer-events-none opacity-20"
        />
        
        {/* VELOCITY-BASED FOG OVERLAY */}
        <motion.div
          className="absolute inset-0 z-5 pointer-events-none"
          animate={{
            background: `radial-gradient(circle at 50% 50%, 
              rgba(0,0,0,0) 0%, 
              rgba(0,0,0,${scrollIntensity * 0.3}) 50%, 
              rgba(0,0,0,${scrollIntensity * 0.6}) 100%)`
          }}
        />

        {/* ENHANCED AMBIENT PARTICLES WITH VELOCITY */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => {
            const size = Math.random() * 3 + 1
            const speedMultiplier = 1 + scrollIntensity * 2
            
            return (
              <motion.div
                key={`velocity-particle-${i}`}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  filter: `blur(${scrollIntensity}px)`,
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 100 * speedMultiplier],
                  y: [0, (Math.random() - 0.5) * 100 * speedMultiplier],
                  opacity: [0.1, 0.3 * scrollIntensity, 0.1],
                  scale: [1, 1 + scrollIntensity, 1],
                }}
                transition={{
                  duration: 3 / speedMultiplier,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            )
          })}
        </div>

        {/* COMPLETION OVERLAY */}
        <AnimatePresence>
          {isHorizontalComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 pointer-events-none"
            >
              {/* Velocity burst effect */}
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: [0, 1.5, 1], rotate: 360 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                }}
              />
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200,
                    damping: 15
                  }}
                  className="w-28 h-28 rounded-full border-2 border-white/30 flex items-center justify-center mx-auto mb-6 relative"
                >
                  {/* Speed lines */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-8 bg-gradient-to-b from-white/50 to-transparent"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-40px)`,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scaleY: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                  
                  <motion.span
                    animate={{ 
                      scale: [1, 1.3, 1],
                      rotate: [0, 180, 360] 
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="text-5xl"
                  >
                    ∞
                  </motion.span>
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-mono text-sm text-white/60 tracking-wider mb-2"
                >
                  LOOPING COLLECTION
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ delay: 0.5 }}
                  className="text-xs text-white/40 font-mono"
                >
                  Infinite exploration • {hoodies.length} items
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* VELOCITY INDICATOR */}
        <div className="fixed top-8 right-8 z-30">
          <div className="backdrop-blur-md bg-black/40 px-6 py-3 rounded-2xl border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* Speedometer needle */}
                <motion.div
                  className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center"
                  animate={{ rotate: scrollIntensity * 180 }}
                >
                  <div className="w-1 h-4 bg-white/80 rounded-full" 
                    style={{ transform: `rotate(${scrollIntensity * 90}deg)` }}
                  />
                </motion.div>
                
                {/* Glow based on speed */}
                <motion.div
                  className="absolute inset-0 rounded-full blur-md"
                  animate={{
                    background: `radial-gradient(circle, 
                      rgba(255,255,255,${scrollIntensity * 0.3}) 0%, 
                      transparent 70%)`
                  }}
                />
              </div>
              
              <div>
                <div className="text-xs text-white/40 font-mono">SCROLL SPEED</div>
                <div className="text-sm text-white/80 font-mono">
                  {Math.round(scrollIntensity * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ENHANCED SLIDE COUNTER */}
        <div className="fixed bottom-8 left-8 z-30">
          <div className="flex items-center gap-3 backdrop-blur-md bg-black/40 px-6 py-4 rounded-2xl border border-white/20 shadow-2xl">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => {
                const activeIndex = (activeSlide + i) % hoodies.length
                return (
                  <motion.div
                    key={i}
                    className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center text-xs font-mono"
                    animate={{
                      scale: i === 0 ? [1, 1.1, 1] : 1,
                      backgroundColor: i === 0 
                        ? `rgba(255,255,255,${0.1 + scrollIntensity * 0.2})` 
                        : "rgba(255,255,255,0.05)",
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {activeIndex + 1}
                  </motion.div>
                )
              })}
            </div>
            
            <div className="ml-4">
              <div className="font-mono text-sm text-white/60">
                <span className="text-white/80 text-lg">{activeSlide + 1}</span>
                <span className="mx-2 text-white/40">/</span>
                <span className="text-white/60">{hoodies.length}</span>
              </div>
              <motion.div
                className="text-xs text-white/40 font-mono tracking-wider mt-1"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isLooping ? "LOOPING • " : ""}DRAG →
              </motion.div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="h-screen overflow-visible relative perspective-1000">
          {/* VELOCITY-BASED TITLE EFFECTS */}
          <div className="drops-title-container absolute top-24 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
            <motion.div
              animate={{ 
                scale: 1 + scrollIntensity * 0.1,
                filter: `blur(${scrollIntensity * 2}px)`
              }}
            >
              <motion.div
                className="mb-8"
                animate={{ 
                  opacity: 1 - scrollIntensity * 0.5 
                }}
              >
                <div className="flex items-center justify-center gap-4 mb-4">
                  <motion.div
                    className="h-px bg-gradient-to-r from-transparent via-white to-transparent"
                    animate={{ width: ["40px", "60px", "40px"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <p className="font-mono text-white/60 tracking-[0.3em] text-sm">
                    DYNAMIC BROWSE
                  </p>
                  <motion.div
                    className="h-px bg-gradient-to-r from-transparent via-white to-transparent"
                    animate={{ width: ["40px", "60px", "40px"] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                </div>
              </motion.div>
              
              <motion.h2
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                animate={{
                  textShadow: `
                    0 0 ${10 + scrollIntensity * 20}px rgba(255,255,255,0.5),
                    0 0 ${20 + scrollIntensity * 40}px rgba(255,255,255,0.3)
                  `,
                  letterSpacing: `${1 + scrollIntensity * 2}px`
                }}
              >
                <span className="bg-gradient-to-r from-white via-white/90 to-white bg-clip-text text-transparent">
                  {scrollIntensity > 0.7 ? "HYPERSCROLL" : "Current Drops"}
                </span>
              </motion.h2>
              
              <motion.p
                className="mt-4 text-sm font-mono max-w-md mx-auto"
                animate={{ opacity: 0.8 - scrollIntensity * 0.5 }}
              >
                {scrollIntensity > 0.8 
                  ? "MAXIMUM VELOCITY • DISTORTION ACTIVE" 
                  : scrollIntensity > 0.5
                  ? "HIGH SPEED • EFFECTS ENGAGED"
                  : isLooping 
                  ? "Infinite loop • Scroll continuously"
                  : `Explore ${hoodies.length} exclusive pieces`
                }
              </motion.p>
            </motion.div>
          </div>

          {/* INFINITE LOOP TRACK */}
          <div
            ref={trackRef}
            className="absolute inset-0 flex items-center will-change-transform"
            style={{ 
              width: "max-content",
              transformStyle: "preserve-3d",
              gap: `${300 - scrollIntensity * 100}px`,
              paddingLeft: "50vw",
              paddingRight: "50vw"
            }}
          >
            {/* INFINITE LOOP: DOUBLE THE HOODIES FOR SEAMLESS TRANSITION */}
            {[...hoodies, ...hoodies].map((hoodie, index) => {
              const adjustedIndex = index % hoodies.length
              const distanceFromCenter = Math.abs(adjustedIndex - activeSlide)
              const isDuplicate = index >= hoodies.length
              
              // Calculate position in infinite loop
              let loopPosition = index
              if (isLooping && index >= hoodies.length) {
                loopPosition = index - hoodies.length
              }
              
              const zDepth = -distanceFromCenter * (100 - scrollIntensity * 50)
              const scale = 1 - distanceFromCenter * 0.15
              const opacity = 0.2 + (1 - distanceFromCenter * 0.25) * (isDuplicate ? 0.5 : 1)
              const blur = distanceFromCenter * (2 + scrollIntensity * 3)
              const saturation = 100 + scrollIntensity * 100
              
              return (
                <motion.div
                  key={`${hoodie.id}-${index}`}
                  ref={getSlideRef(index)}
                  className="hoodie-slide min-w-[450px] flex-shrink-0 relative group"
                  data-index={loopPosition}
                  style={{
                    transform: `translateZ(${zDepth}px) scale(${scale})`,
                    opacity: opacity,
                    filter: `blur(${blur}px) saturate(${saturation}%)`,
                  }}
                  animate={{
                    scale: adjustedIndex === activeSlide ? 1.2 : scale,
                    opacity: adjustedIndex === activeSlide ? 1 : opacity,
                    filter: adjustedIndex === activeSlide 
                      ? `blur(0px) saturate(${100 + scrollIntensity * 100}%)`
                      : `blur(${blur}px) saturate(${saturation}%)`,
                    zIndex: adjustedIndex === activeSlide ? 50 : 10 - distanceFromCenter,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200 - scrollIntensity * 100,
                    damping: 20,
                    mass: 0.5
                  }}
                  whileHover={{ 
                    scale: (adjustedIndex === activeSlide ? 1.2 : scale) * 1.1,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                  onHoverStart={() => {
                    if (adjustedIndex === activeSlide) {
                      createRippleEffect(adjustedIndex)
                    }
                  }}
                >
                  {/* VELOCITY-BASED GLOW */}
                  <motion.div
                    className="absolute -inset-8 rounded-3xl"
                    animate={{
                      background: `radial-gradient(circle, 
                        rgba(255,255,255,${0.1 + scrollIntensity * 0.2}) 0%, 
                        transparent 70%)`,
                      scale: 1 + scrollIntensity * 0.2
                    }}
                  />
                  
                  {/* DISTORTION WAVE INDICATOR */}
                  {adjustedIndex === activeSlide && (
                    <motion.div
                      className="absolute -inset-12 rounded-3xl border border-white/20"
                      initial={{ scale: 1, opacity: 0 }}
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0, 0.3, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    />
                  )}
                  
                  {/* DUPLICATE INDICATOR (FOR INFINITE LOOP) */}
                  {isDuplicate && !isLooping && (
                    <div className="absolute -top-3 -right-3 z-50">
                      <div className="w-6 h-6 rounded-full bg-black/80 border border-white/20 flex items-center justify-center">
                        <span className="text-xs text-white/60">∞</span>
                      </div>
                    </div>
                  )}
                  
                  <HoodieCard {...hoodie} />
                </motion.div>
              )
            })}
          </div>
          
          {/* CENTER GUIDE WITH VELOCITY EFFECTS */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Velocity lines */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{
                width: `${100 + scrollIntensity * 200}px`,
                height: `${4 + scrollIntensity * 10}px`,
                opacity: 0.1 + scrollIntensity * 0.2
              }}
              style={{
                background: `linear-gradient(90deg, 
                  transparent, 
                  rgba(255,255,255,${0.3 + scrollIntensity * 0.7}), 
                  transparent)`,
                filter: `blur(${scrollIntensity * 5}px)`
              }}
            />
            
            {/* Speed trail effect */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{
                width: `${scrollIntensity * 500}px`,
                opacity: scrollIntensity * 0.1
              }}
              style={{
                height: "2px",
                background: "linear-gradient(90deg, transparent, white, transparent)",
                filter: "blur(1px)"
              }}
            />
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