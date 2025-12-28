"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    shop: [
      { name: "All Products", href: "/shop" },
      { name: "New Arrivals", href: "/new" },
      { name: "Best Sellers", href: "/bestsellers" },
      { name: "Lookbook", href: "/lookbook" },
    ],
    info: [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Shipping", href: "/shipping" },
      { name: "Returns", href: "/returns" },
    ],
    connect: [
      { name: "Instagram", href: "https://instagram.com" },
      { name: "Twitter", href: "https://twitter.com" },
      { name: "TikTok", href: "https://tiktok.com" },
      { name: "Discord", href: "https://discord.com" },
    ],
  }

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative mt-32 w-full overflow-hidden border-t border-white/10"
    >
      {/* ===== ABSTRACT GRAPHIC ELEMENT ===== */}
      <div className="absolute top-0 left-0 w-full -translate-y-full overflow-hidden">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-32"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="footer-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" />
              <stop offset="50%" stopColor="#111111" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
          </defs>
          <path
            d="M0,0 C360,80 720,40 1080,60 1440,80 1440,120 1440,120 L0,120 Z"
            fill="url(#footer-gradient)"
          />
        </svg>
      </div>

      {/* ===== FOOTER CONTENT ===== */}
      <div className="relative bg-black pt-20">
        {/* GRID BACKGROUND */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `linear-gradient(to right, white 1px, transparent 1px),
                               linear-gradient(to bottom, white 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* MAIN CONTENT GRID */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            {/* BRAND COLUMN */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-4"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tighter mb-6">
                  VISIONDROP
                </h2>
                <p className="text-white/60 leading-relaxed max-w-md">
                  Premium streetwear inspired by underground culture and 
                  avant-garde design. For those who see beyond the surface.
                </p>
              </div>

              {/* SOCIAL LINKS */}
              <div className="flex gap-4">
                {footerLinks.connect.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white transition-colors group"
                  >
                    <span className="text-xs font-mono tracking-wider group-hover:text-white text-white/60">
                      {social.name.charAt(0)}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* LINKS COLUMNS */}
            <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* SHOP */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-medium mb-6 tracking-wider text-sm text-white/80">SHOP</h3>
                <ul className="space-y-4">
                  {footerLinks.shop.map((link, index) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="text-white/60 hover:text-white transition-colors text-sm tracking-wide inline-flex items-center gap-2 group"
                      >
                        <span>{link.name}</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* INFO */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-medium mb-6 tracking-wider text-sm text-white/80">INFO</h3>
                <ul className="space-y-4">
                  {footerLinks.info.map((link, index) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="text-white/60 hover:text-white transition-colors text-sm tracking-wide inline-flex items-center gap-2 group"
                      >
                        <span>{link.name}</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* NEWSLETTER */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="col-span-2 md:col-span-1"
              >
                <h3 className="font-medium mb-6 tracking-wider text-sm text-white/80">STAY CONNECTED</h3>
                <p className="text-white/60 text-sm mb-6">
                  Subscribe for exclusive drops, early access, and underground culture.
                </p>
                
                <form className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 border border-white text-white rounded-lg hover:bg-white hover:text-black transition-all duration-300 text-sm font-medium tracking-wider"
                  >
                    SUBSCRIBE
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="border-t border-white/10 pt-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <p className="text-white/40 text-sm">
                  © {currentYear} VISIONDROP. All rights reserved.
                </p>
                <p className="text-white/20 text-xs font-mono mt-2">
                  Designed for the underground.
                </p>
              </div>

              {/* LEGAL LINKS */}
              <div className="flex flex-wrap gap-6 justify-center">
                {["Privacy Policy", "Terms of Service", "Cookies"].map((item, index) => (
                  <motion.a
                    key={item}
                    href="#"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-white/40 hover:text-white text-sm transition-colors"
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* CREDITS */}
            <div className="mt-8 text-center">
              <p className="text-white/20 text-xs font-mono">
                V1.0 — Built with Next.js & Framer Motion
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}