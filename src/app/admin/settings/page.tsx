"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface SiteSettings {
  siteTitle: string
  siteDescription: string | null
  heroImage: string | null
  featuredCount: number
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteTitle: "xPhotoAlbum",
    siteDescription: "",
    heroImage: null,
    featuredCount: 12,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const res = await fetch("/api/settings")
      const data = await res.json()
      setSettings(data)
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (res.ok) {
        setSettings({ ...settings, heroImage: data.url })
      }
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        alert("设置已保存！")
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Save error:", error)
      alert("保存失败")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-20 text-gray-400">加载中...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">网站设置</h1>
        <p className="text-gray-400">配置你的摄影作品展示网站</p>
      </div>

      <div className="max-w-3xl space-y-8">
        {/* Hero Image */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4">首页横幅图片</h2>
          <p className="text-gray-400 text-sm mb-4">
            这张图片将显示在网站首页的顶部，建议使用高分辨率的横版图片。
          </p>
          {settings.heroImage ? (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={settings.heroImage}
                alt="Hero"
                fill
                className="object-cover"
              />
              <button
                onClick={() => setSettings({ ...settings, heroImage: null })}
                className="absolute top-2 right-2 bg-black/50 text-white px-3 py-1 rounded-lg hover:bg-black/70 text-sm"
              >
                移除
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center">
              <div className="text-4xl mb-4">🖼️</div>
              <input
                type="file"
                accept="image/*"
                onChange={handleHeroUpload}
                className="hidden"
                id="hero-upload"
                disabled={uploading}
              />
              <label
                htmlFor="hero-upload"
                className="cursor-pointer inline-block px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                {uploading ? "上传中..." : "上传横幅图片"}
              </label>
            </div>
          )}
        </div>

        {/* Site Title */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4">网站标题</h2>
          <input
            type="text"
            value={settings.siteTitle}
            onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            placeholder="xPhotoAlbum"
          />
        </div>

        {/* Site Description */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4">网站描述</h2>
          <textarea
            value={settings.siteDescription || ""}
            onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            rows={3}
            placeholder="专业摄影作品展示"
          />
        </div>

        {/* Featured Count */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4">首页精选作品数量</h2>
          <p className="text-gray-400 text-sm mb-4">
            设置首页显示的精选作品数量（需要先在作品管理中标记作品为精选）
          </p>
          <input
            type="number"
            value={settings.featuredCount}
            onChange={(e) => setSettings({ ...settings, featuredCount: parseInt(e.target.value) || 12 })}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            min={1}
            max={50}
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {saving ? "保存中..." : "保存设置"}
          </Button>
        </div>
      </div>
    </div>
  )
}
