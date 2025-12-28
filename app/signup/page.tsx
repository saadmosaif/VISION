"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    interest: "general",
    agree: false,
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send data to an API
    console.log("Form submitted:", formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ email: "", name: "", interest: "general", agree: false })
    }, 3000)
  }

  return (
    <main className="min-h-screen bg-neutral-950">
      {/* Header */}
      <section className="w-full py-16 md:py-24 bg-neutral-900 border-b border-neutral-800">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-green-400 text-sm mb-4 inline-block hover:text-green-300">
            ← Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Join The Movement</h1>
          <p className="text-lg text-neutral-400">
            Stay connected with VisionDrop. Get updates on drops, community events, and underground culture.
          </p>
        </div>
      </section>

      {/* Signup Form */}
      <section className="w-full py-16 md:py-24 bg-neutral-950">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Form Column */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Sign Up</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">I'm interested in</label>
                  <select
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded text-white focus:outline-none focus:border-green-500 transition-colors"
                  >
                    <option value="general">Everything VisionDrop</option>
                    <option value="drops">New Drops</option>
                    <option value="community">Community Events</option>
                    <option value="updates">Brand Updates</option>
                  </select>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="agree"
                    id="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 rounded border-neutral-700 text-green-500 focus:ring-0"
                    required
                  />
                  <label htmlFor="agree" className="text-sm text-neutral-400">
                    I agree to receive updates and promotional emails from VisionDrop. I can unsubscribe anytime.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#BD14E3] text-black font-semibold rounded hover:bg-[#BD14E3] transition-colors mt-6"
                >
                  Join The Movement
                </button>

                {submitted && (
                  <div className="p-4 bg-bg-[#BD14E3] border border-bg-[#BD14E3] rounded text-[#BD14E3] text-sm">
                    Thanks for joining! Check your email for confirmation.
                  </div>
                )}
              </form>
            </div>

            {/* Info Column */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-green-400 mb-3">What You Get</h3>
                <ul className="space-y-3">
                  {[
                    "Early access to new drops",
                    "Exclusive community invites",
                    "Behind-the-scenes content",
                    "Special member discounts",
                    "Insider stories from the movement",
                    "Direct connection with VisionDrop",
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-neutral-300">
                      <span className="text-green-400 flex-shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-purple-400 mb-3">Our Promise</h3>
                <p className="text-neutral-400 leading-relaxed">
                  We respect your inbox. No spam. No corporate nonsense. Just authentic updates about VisionDrop, the
                  community, and the underground culture we celebrate.
                </p>
              </div>

              <div className="p-4 border border-neutral-700 rounded">
                <p className="text-sm text-neutral-400">
                  <span className="text-neutral-600">Already a member?</span>{" "}
                  <Link href="/community" className="text-green-400 hover:text-green-300">
                    Explore the community
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-16 md:py-24 bg-neutral-900 border-t border-neutral-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">15K+</div>
              <p className="text-neutral-400">Community Members</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">30+</div>
              <p className="text-neutral-400">Countries Connected</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">100%</div>
              <p className="text-neutral-400">Underground Authentic</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
