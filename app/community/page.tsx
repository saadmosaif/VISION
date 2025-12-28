"use client"

import { useState } from "react"
import Link from "next/link"

interface CommunityMember {
  id: number
  name: string
  role: string
  bio: string
  location: string
  instagram?: string
  featured: boolean
}

export default function Community() {
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null)

  const members: CommunityMember[] = [
    {
      id: 1,
      name: "Alex Chen",
      role: "Founder & Creative Director",
      bio: "Visionary behind the VisionDrop movement. Bringing underground culture to the mainstream through authentic streetwear.",
      location: "New York, USA",
      instagram: "@alexvisioned",
      featured: true,
    },
    {
      id: 2,
      name: "Luna Park",
      role: "Community Manager",
      bio: "Connecting the global VisionDrop family. Passionate about rave culture and building authentic communities.",
      location: "Los Angeles, USA",
      instagram: "@lunapark_rave",
      featured: true,
    },
    {
      id: 3,
      name: "Kai Santos",
      role: "Model & Brand Ambassador",
      bio: "Living the VisionDrop lifestyle. Street photographer and underground scene enthusiast.",
      location: "São Paulo, Brazil",
      instagram: "@kai_santos_underground",
      featured: true,
    },
    {
      id: 4,
      name: "Maya Johnson",
      role: "Designer",
      bio: "Crafting pieces that tell stories. Inspired by underground art and street culture aesthetics.",
      location: "Berlin, Germany",
      instagram: "@maya_designs_vd",
      featured: false,
    },
    {
      id: 5,
      name: "Rio Martinez",
      role: "Community Member",
      bio: "VisionDrop believer. Supporting the movement and spreading the underground vision globally.",
      location: "Mexico City, Mexico",
      instagram: "@rio_visiondrop",
      featured: false,
    },
    {
      id: 6,
      name: "Zara Okonkwo",
      role: "Content Creator",
      bio: "Documenting the VisionDrop culture. Creating authentic content that celebrates our community.",
      location: "London, UK",
      instagram: "@zara_captures",
      featured: true,
    },
    {
      id: 7,
      name: "Dante Black",
      role: "Community Member",
      bio: "Underground enthusiast. Supporting VisionDrop and building connections within the rave community.",
      location: "Amsterdam, Netherlands",
      instagram: "@dante_underground",
      featured: false,
    },
    {
      id: 8,
      name: "Sophie Durand",
      role: "Brand Ambassador",
      bio: "Living the VisionDrop ethos. Passionate about connecting underground communities worldwide.",
      location: "Paris, France",
      instagram: "@sophie_visiondrop",
      featured: true,
    },
  ]

  const featuredMembers = members.filter((m) => m.featured)
  const allMembers = members

  return (
    <main className="min-h-screen bg-neutral-950">
      {/* Header */}
      <section className="w-full py-16 md:py-24 bg-neutral-900 border-b border-neutral-800">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-green-400 text-sm mb-4 inline-block hover:text-green-300">
            ← Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">The VisionDrop Family</h1>
          <p className="text-lg text-neutral-400">Meet the people building the movement</p>
        </div>
      </section>

      {/* Featured Members */}
      <section className="w-full py-16 md:py-24 bg-neutral-900 border-b border-neutral-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Featured Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMembers.map((member) => (
              <div key={member.id} onClick={() => setSelectedMember(member)} className="cursor-pointer group">
                <div className="relative overflow-hidden rounded-lg mb-4 aspect-square bg-neutral-800 border border-neutral-700 group-hover:border-purple-500 transition-colors">
                  <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center group-hover:from-purple-900/30 group-hover:to-neutral-900 transition-all">
                    <span className="text-neutral-600">{member.name}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                <p className="text-sm text-purple-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Community Members */}
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="p-6 rounded-lg border border-neutral-700 bg-neutral-900/30 hover:bg-neutral-800/50 hover:border-purple-500 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-green-500 mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{member.name.charAt(0)}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-sm text-purple-400 mb-3">{member.role}</p>
                <p className="text-sm text-neutral-400 mb-4 line-clamp-2">{member.bio}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">{member.location}</span>
                  {member.instagram && (
                    <a
                      href={`https://instagram.com/${member.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {member.instagram}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Member Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-neutral-900 rounded-lg p-8 max-w-2xl w-full border border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMember(null)}
              className="float-right text-neutral-500 hover:text-white mb-4"
            >
              ✕
            </button>
            <div className="flex gap-6 mb-6">
              <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-4xl">{selectedMember.name.charAt(0)}</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedMember.name}</h2>
                <p className="text-lg text-purple-400 mb-4">{selectedMember.role}</p>
                <p className="text-neutral-400 mb-4">{selectedMember.location}</p>
                {selectedMember.instagram && (
                  <a
                    href={`https://instagram.com/${selectedMember.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    {selectedMember.instagram}
                  </a>
                )}
              </div>
            </div>
            <p className="text-neutral-300 leading-relaxed">{selectedMember.bio}</p>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="w-full py-16 md:py-20 bg-neutral-900 border-t border-neutral-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Join The Movement</h2>
          <p className="text-neutral-400 mb-8">
            Become part of the VisionDrop community and connect with underground culture worldwide.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition-colors"
          >
            Get Involved
          </Link>
        </div>
      </section>
    </main>
  )
}
