import Link from "next/link"
import PhotoCarousel from "@/components/photo-carousel"

export default function About() {
  return (
    <main className="min-h-screen bg-neutral-950">
      {/* Header */}
      <section className="w-full py-16 md:py-24 bg-neutral-900 border-b border-neutral-800">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-green-400 text-sm mb-4 inline-block hover:text-green-300">
            ← Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">About VisionDrop</h1>
          <p className="text-lg text-neutral-400">Understanding the movement behind the brand</p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="w-full py-16 md:py-24 bg-neutral-950">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-16">
            <p className="text-green-400 text-sm md:text-base font-mono mb-3">OUR VISION</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">We Are The Underground</h2>
            <p className="text-lg text-neutral-300 leading-relaxed mb-4">
              VisionDrop is more than a brand. It's a cultural movement celebrating the authentic expression of
              underground communities worldwide. We believe in the power of connection, rebellion, and unfiltered
              creativity.
            </p>
            <p className="text-lg text-neutral-300 leading-relaxed">
              Founded on the principles of rave culture, street style, and community solidarity, VisionDrop exists to
              give voice to those who refuse to conform. We stand at the intersection of music, fashion, and cultural
              resistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 border border-neutral-700 rounded-lg hover:border-green-500 transition-colors">
              <h3 className="text-green-400 font-semibold mb-3">COMMUNITY FIRST</h3>
              <p className="text-neutral-400">
                We believe in the power of collective identity and shared vision. Every piece tells a story of the
                communities we represent.
              </p>
            </div>
            <div className="p-6 border border-neutral-700 rounded-lg hover:border-purple-500 transition-colors">
              <h3 className="text-purple-400 font-semibold mb-3">AUTHENTIC EXPRESSION</h3>
              <p className="text-neutral-400">
                We celebrate unfiltered creativity and genuine connection. Our designs reflect real stories from real
                people in the underground.
              </p>
            </div>
            <div className="p-6 border border-neutral-700 rounded-lg hover:border-orange-500 transition-colors">
              <h3 className="text-orange-400 font-semibold mb-3">CULTURAL RESISTANCE</h3>
              <p className="text-neutral-400">
                We challenge the mainstream narrative. VisionDrop stands for those who choose their own path and build
                their own culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="w-full py-16 md:py-24 bg-neutral-950 border-t border-neutral-800 border-b border-neutral-800">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="text-purple-400 text-sm md:text-base font-mono mb-3">THE MANIFESTO</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">VisionDrop Principles</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-green-400 mb-3">1. VISION OVER TRENDS</h3>
              <p className="text-neutral-300 leading-relaxed">
                We don't follow trends. We create them. Our vision comes from the underground, from the real communities
                that shape culture. Every piece we create carries purpose and meaning beyond aesthetics.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-purple-400 mb-3">2. COMMUNITY IS CURRENCY</h3>
              <p className="text-neutral-300 leading-relaxed">
                The connections we build are more valuable than any monetary transaction. We measure success by the
                strength of our community, the stories shared, and the movements we inspire. Your voice matters here.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-orange-400 mb-3">3. AUTHENTICITY IS NON-NEGOTIABLE</h3>
              <p className="text-neutral-300 leading-relaxed">
                We reject manufactured personas and corporate speak. What you see is what you get. Real people. Real
                stories. Real culture. VisionDrop exists at the intersection where underground meets mainstream, without
                losing its soul.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-green-400 mb-3">4. CULTURE IS REBELLION</h3>
              <p className="text-neutral-300 leading-relaxed">
                We celebrate those who think differently, who create without permission, who build their own
                communities. VisionDrop is for the underground, the ravers, the street artists, the rebels who refuse to
                blend in.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-purple-400 mb-3">5. QUALITY WITH PURPOSE</h3>
              <p className="text-neutral-300 leading-relaxed">
                Every hoodie, tee, and accessory is crafted with intention. We use sustainable materials, support fair
                practices, and create pieces built to last. Quality isn't just material—it's respect for those who wear
                it.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-orange-400 mb-3">6. GLOBAL UNDERGROUND</h3>
              <p className="text-neutral-300 leading-relaxed">
                VisionDrop connects underground communities across continents. From New York to Tokyo, Berlin to São
                Paulo, we're building a global network of rebels, artists, and culture makers. Geography doesn't define
                us—vision does.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="w-full py-16 md:py-24 bg-neutral-950">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="text-green-400 text-sm md:text-base font-mono mb-3">HOW IT STARTED</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">The Journey Begins</h2>

          <div className="space-y-6 text-neutral-300">
            <p className="leading-relaxed">
              VisionDrop was born from a simple observation: the underground culture that shapes society—the music, the
              fashion, the movements—deserved authentic representation. Not diluted for mainstream consumption, but pure
              and unapologetic.
            </p>
            <p className="leading-relaxed">
              Started in 2024, VisionDrop began as a conversation among friends passionate about rave culture, street
              style, and community building. We believed that fashion could be a vehicle for cultural expression, that
              clothing could be a statement of identity and belonging.
            </p>
            <p className="leading-relaxed">
              Today, VisionDrop is a growing movement spanning multiple continents. Our community includes artists,
              musicians, designers, and culture makers who share a vision of authentic, rebellious fashion. We're not
              just selling hoodies—we're building a global tribe united by shared values and cultural resistance.
            </p>
            <p className="leading-relaxed">
              Every drop represents a moment in our collective story. Every person wearing VisionDrop becomes part of
              the movement, adding their own chapter to the VisionDrop legacy.
            </p>
          </div>
        </div>
      </section>

      {/* Photo Carousel Gallery */}
      <section className="w-full py-16 md:py-24 bg-neutral-950 border-t border-neutral-800">
        <div className="container mx-auto px-4">
          <PhotoCarousel title="Community Gallery" description="Moments from the global VisionDrop movement" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-20 bg-neutral-950 border-t border-neutral-800">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready To Join?</h2>
          <p className="text-neutral-400 mb-8">
            Become part of the global VisionDrop community and help shape the future of underground culture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/lookbook"
              className="px-8 py-3 bg-[#BD14E3] text-black font-semibold rounded hover:bg-[#BD14E3] transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/community"
              className="px-8 py-3 border border-purple-500 text-purple-400 font-semibold rounded hover:bg-purple-500 hover:text-black transition-colors"
            >
              Meet The Community
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
