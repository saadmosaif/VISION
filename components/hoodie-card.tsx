"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"

interface HoodieCardProps {
  id: number
  name: string
  price: number
  image1: string
  image2: string
}

export function HoodieCard({
  id,
  name,
  price,
  image1,
  image2,
}: HoodieCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={false}
      animate={{
        y: hovered ? -8 : 0,
      }}
      transition={{ duration: 0.4, ease: [0.83, 0, 0.17, 1] }}
      className="relative bg-black rounded-2xl overflow-hidden cursor-pointer group border border-white/10 hover:border-white/30 transition-colors"
    >
      {/* IMAGE WRAPPER */}
      <div className="relative aspect-square overflow-hidden">
        {/* Base image */}
        <motion.div
          animate={{ 
            opacity: hovered ? 0 : 1,
            scale: hovered ? 1.05 : 1
          }}
          transition={{ duration: 0.6, ease: [0.83, 0, 0.17, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={image1}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
            priority={id <= 4}
          />
        </motion.div>

        {/* Hover image */}
        <motion.div
          animate={{ 
            opacity: hovered ? 1 : 0,
            scale: hovered ? 1 : 1.05
          }}
          transition={{ duration: 0.6, ease: [0.83, 0, 0.17, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={image2}
            alt={`${name} - Alternative view`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </motion.div>

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* QUICK VIEW BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
          transition={{ duration: 0.3 }}
          className="absolute top-4 right-4 z-20"
        >
          <span className="px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-mono tracking-wider rounded-full">
            QUICK VIEW
          </span>
        </motion.div>
      </div>

      {/* CONTENT */}
      <div className="relative p-6 z-10 bg-black">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-white">${price.toFixed(2)}</p>
            <span className="text-xs text-white/60 font-mono tracking-wider">
              00{id}
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: hovered ? 1 : 0,
            height: hovered ? "auto" : 0,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <Link href={`/product/${id}`} className="block">
            <button className="w-full py-3 rounded-full border border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300 font-medium tracking-wider text-sm">
              VIEW PRODUCT
            </button>
          </Link>
        </motion.div>
      </div>
    </motion.article>
  )
}