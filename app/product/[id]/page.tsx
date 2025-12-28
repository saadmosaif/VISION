"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart } from "lucide-react"

const hoodies = [
  {
    id: 1,
    name: "SDFM Classic Black",
    price: 149.99,
    image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
    image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg",
    description:
      "Elevate your streetwear game with the SDFM Classic Black hoodie. Crafted from premium materials, this timeless piece combines comfort with style.",
    colors: ["Black", "Gray", "Navy"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    features: [
      "Premium cotton-blend fabric",
      "Reinforced stitching",
      "Kangaroo pocket design",
      "Adjustable drawstrings",
      "Screen-printed VisionDrop logo",
    ],
  },
  {
    id: 2,
    name: "SDFM Premium Gray",
    price: 154.99,
    image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
    image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg",
    description:
      "Our Premium Gray hoodie offers a sophisticated neutral tone that pairs perfectly with any outfit. Experience luxury comfort with every wear.",
    colors: ["Gray", "Charcoal", "Light Gray"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    features: [
      "Ultra-soft fabric blend",
      "Double-layered construction",
      "Embroidered VisionDrop logo",
      "Breathable lining",
      "Perfect for all seasons",
    ],
  },
  {
    id: 3,
    name: "SDFM Signature Navy",
    price: 159.99,
    image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
    image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg",
    description:
      "The Signature Navy hoodie is a wardrobe essential. With its deep, rich color and premium construction, it's designed for those who demand quality.",
    colors: ["Navy", "Dark Blue", "Royal Blue"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    features: [
      "Premium twill fabric",
      "Contrast drawstrings",
      "Metal-tipped cords",
      "Hidden zippered pockets",
      "Professional-grade stitching",
    ],
  },
  {
    id: 4,
    name: "SDFM Limited Edition",
    price: 199.99,
    image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
    image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg",
    description:
      "The ultimate luxury hoodie. Our Limited Edition features exclusive design elements and premium materials available only to VisionDrop collectors.",
    colors: ["Black"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    features: [
      "Limited to 500 units worldwide",
      "Rare fabric blend",
      "Hand-embroidered details",
      "Exclusive serialization",
      "Lifetime warranty",
    ],
  },
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = hoodies.find((h) => h.id === Number.parseInt(params.id))
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "")
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-100 mb-4">Product not found</h1>
          <Link href="/">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-dark-900 py-12">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-gray-100 mb-8 transition">
          <ArrowLeft size={20} />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-dark-800">
              <Image
                src={product.image1 || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden bg-dark-800">
              <Image src={product.image2 || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-100 mb-2">{product.name}</h1>
              <p className="text-3xl font-bold text-gray-300 mb-4">${product.price.toFixed(2)}</p>
              <p className="text-gray-400 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-gray-100 font-semibold mb-3">Color</label>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedColor === color
                        ? "bg-gray-100 text-dark-900"
                        : "bg-dark-800 text-gray-300 hover:bg-dark-700"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-gray-100 font-semibold mb-3">Size</label>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 rounded-lg font-medium transition ${
                      selectedSize === size
                        ? "bg-gray-100 text-dark-900"
                        : "bg-dark-800 text-gray-300 hover:bg-dark-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-gray-100 font-semibold mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 bg-dark-800 text-gray-300 rounded-lg hover:bg-dark-700 transition"
                >
                  −
                </button>
                <span className="text-gray-100 font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 bg-dark-800 text-gray-300 rounded-lg hover:bg-dark-700 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button size="lg" className="w-full gap-2">
              <ShoppingCart size={20} />
              Add to Cart
            </Button>

            {/* Features */}
            <div className="border-t border-dark-700 pt-6">
              <h3 className="text-gray-100 font-semibold mb-4">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-gray-400 flex items-start gap-3">
                    <span className="text-gray-300 mt-1">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
