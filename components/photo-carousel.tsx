"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PhotoCarouselProps {
  title?: string
  description?: string
}

export default function PhotoCarousel({
  title = "Community Gallery",
  description = "Moments from the VisionDrop movement",
}: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  const photos = [
    {
      id: 1,
      title: "Underground Culture",
      description: "Celebrating rave and street culture",
      image: "/underground-rave-culture-event.jpg",
    },
    {
      id: 2,
      title: "Community Connection",
      description: "Building authentic relationships",
      image: "/diverse-community-gathering.png",
    },
    {
      id: 3,
      title: "Street Style",
      description: "Fashion as cultural expression",
      image: "/street-fashion-streetwear-style.jpg",
    },
    {
      id: 4,
      title: "Artistic Expression",
      description: "Creativity without limits",
      image: "/street-art-urban-art-graffiti.jpg",
    },
    {
      id: 5,
      title: "Global Movement",
      description: "Connected across continents",
      image: "/global-city-night-lights.jpg",
    },
    {
      id: 6,
      title: "Rebellion & Freedom",
      description: "Unfiltered and unapologetic",
      image: "/vibrant-neon-lights-dance.jpg",
    },
  ]

  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay, photos.length])

  const goToPrevious = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const goToNext = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlay(false)
    setCurrentIndex(index)
  }

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h2>
        <p className="text-neutral-400">{description}</p>
      </div>

      <div className="relative w-full">
        {/* Main Carousel */}
        <div className="relative w-full overflow-hidden rounded-lg">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={photo.image || "/placeholder.svg"}
                alt={photo.title}
                className="w-full h-96 md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{photo.title}</h3>
                <p className="text-neutral-200">{photo.description}</p>
              </div>
            </div>
          ))}

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-3 mt-6">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all ${
                index === currentIndex ? "bg-green-500 w-8" : "bg-neutral-600 hover:bg-neutral-500 w-3"
              }`}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>

        {/* Photo Counter */}
        <div className="text-center mt-4 text-neutral-400 text-sm">
          {currentIndex + 1} / {photos.length}
        </div>
      </div>
    </div>
  )
}
