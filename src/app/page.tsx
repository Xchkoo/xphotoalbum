"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

interface Photo {
  id: string
  title: string | null
  imageUrl: string
  thumbnailUrl: string | null
  category: string
}

interface SiteSettings {
  siteTitle: string
  siteDescription: string | null
  heroImage: string | null
  featuredCount: number
}

const CATEGORIES = [
  { id: "all", name: "全部", icon: "📸" },
  { id: "portrait", name: "人像", icon: "👤" },
  { id: "landscape", name: "风景", icon: "🏞️" },
  { id: "food", name: "美食", icon: "🍜" },
  { id: "street", name: "街拍", icon: "🚶" },
  { id: "architecture", name: "建筑", icon: "🏛️" },
  { id: "travel", name: "旅行", icon: "✈️" },
  { id: "animal", name: "动物", icon: "🦊" },
  { id: "night", name: "夜景", icon: "🌃" },
  { id: "macro", name: "微距", icon: "🔍" },
  { id: "event", name: "活动", icon: "🎉" },
  { id: "bw", name: "黑白", icon: "⚫" },
  { id: "film", name: "胶片", icon: "🎞️" },
]

export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsRes, photosRes] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/photos?featured=true"),
        ])
        const settingsData = await settingsRes.json()
        const photosData = await photosRes.json()
        setSettings(settingsData)
        setPhotos(photosData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredPhotos = selectedCategory === "all"
    ? photos
    : photos.filter(p => p.category === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      {settings?.heroImage && (
        <section className="relative h-screen w-full">
          <Image
            src={settings.heroImage}
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-4"
            >
              {settings.siteTitle}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 max-w-2xl"
            >
              {settings.siteDescription}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <Link
              href="#gallery"
              className="flex flex-col items-center text-gray-400 hover:text-white transition-colors"
            >
              <span className="text-sm mb-2">Scroll to explore</span>
              <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </Link>
          </motion.div>
        </section>
      )}

      {/* Category Filter */}
      <section id="gallery" className="sticky top-0 z-40 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-white text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg"
              onClick={() => setSelectedPhoto(photo)}
            >
              <Image
                src={photo.imageUrl}
                alt={photo.title || "Photo"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-medium truncate">
                    {photo.title || "Untitled"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {CATEGORIES.find(c => c.id === photo.category)?.name || photo.category}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">暂无作品</p>
          </div>
        )}
      </section>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            onClick={() => setSelectedPhoto(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
            <Image
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.title || "Photo"}
              width={1920}
              height={1080}
              className="w-full h-auto max-h-[85vh] object-contain"
            />
            {selectedPhoto.title && (
              <div className="mt-4 text-center">
                <h3 className="text-xl font-medium text-white">{selectedPhoto.title}</h3>
                <p className="text-gray-400 mt-1">
                  {CATEGORIES.find(c => c.id === selectedPhoto.category)?.name || selectedPhoto.category}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>© 2026 {settings?.siteTitle || "xPhotoAlbum"}. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
