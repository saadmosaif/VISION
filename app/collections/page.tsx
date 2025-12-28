import Link from "next/link"

interface Collection {
  id: number
  name: string
  description: string
  releaseDate: string
  itemCount: number
  featured: boolean
}

export default function Collections() {
  const collections: Collection[] = [
    {
      id: 1,
      name: "The Foundation",
      description: "The beginning of VisionDrop. Essential pieces that define the movement.",
      releaseDate: "December 2024",
      itemCount: 8,
      featured: true,
    },
    {
      id: 2,
      name: "Underground Frequency",
      description: "Celebrating the pulse of the underground scene. Limited edition pieces.",
      releaseDate: "November 2024",
      itemCount: 12,
      featured: true,
    },
    {
      id: 3,
      name: "Rave Collective",
      description: "Inspired by rave culture and the energy of the community.",
      releaseDate: "October 2024",
      itemCount: 6,
      featured: false,
    },
    {
      id: 4,
      name: "Street Evolution",
      description: "Street culture meets underground art. A blend of style and rebellion.",
      releaseDate: "September 2024",
      itemCount: 10,
      featured: false,
    },
  ]

  return (
    <main className="min-h-screen bg-neutral-950">
      {/* Header */}
      <section className="w-full py-16 md:py-24 bg-neutral-900 border-b border-neutral-800">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-green-400 text-sm mb-4 inline-block hover:text-green-300">
            ← Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Drops & Collections</h1>
          <p className="text-lg text-neutral-400">Discover limited edition collections and seasonal drops</p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className={`p-8 rounded-lg border transition-all cursor-pointer ${
                  collection.featured
                    ? "border-green-500 bg-neutral-900/50 hover:bg-neutral-800"
                    : "border-neutral-700 bg-neutral-900/30 hover:bg-neutral-800/50"
                }`}
              >
                {collection.featured && (
                  <span className="inline-block px-3 py-1 bg-[#BD14E3] text-black text-xs font-semibold rounded mb-4">
                    FEATURED
                  </span>
                )}
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{collection.name}</h3>
                <p className="text-neutral-400 mb-6">{collection.description}</p>
                <div className="flex justify-between items-center mb-6 text-sm">
                  <span className="text-neutral-500">Released: {collection.releaseDate}</span>
                  <span className="text-green-400">{collection.itemCount} items</span>
                </div>
                <Link
                  href="/lookbook"
                  className="inline-block px-6 py-2 border border-green-500 text-green-400 rounded hover:bg-[#BD14E3] hover:text-black transition-all"
                >
                  View Collection
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
