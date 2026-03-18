"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Photo {
  id: string
  title: string | null
  imageUrl: string
  category: string
  isFeatured: boolean
  album?: { title: string } | null
  createdAt: string
}

interface Album {
  id: string
  title: string
}

const CATEGORIES = [
  { id: "portrait", name: "人像" },
  { id: "landscape", name: "风景" },
  { id: "food", name: "美食" },
  { id: "street", name: "街拍" },
  { id: "architecture", name: "建筑" },
  { id: "travel", name: "旅行" },
  { id: "animal", name: "动物" },
  { id: "night", name: "夜景" },
  { id: "macro", name: "微距" },
  { id: "event", name: "活动" },
  { id: "bw", name: "黑白" },
  { id: "film", name: "胶片" },
]

export default function AdminPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [photosRes, albumsRes] = await Promise.all([
        fetch("/api/photos"),
        fetch("/api/albums"),
      ])
      const photosData = await photosRes.json()
      const albumsData = await albumsRes.json()
      setPhotos(photosData)
      setAlbums(albumsData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  async function deletePhoto(id: string) {
    if (!confirm("确定要删除这张作品吗？")) return

    try {
      const res = await fetch(`/api/photos/${id}`, { method: "DELETE" })
      if (res.ok) {
        setPhotos(photos.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error("Error deleting photo:", error)
    }
  }

  async function toggleFeatured(photo: Photo) {
    try {
      const res = await fetch(`/api/photos/${photo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...photo,
          isFeatured: !photo.isFeatured,
        }),
      })
      if (res.ok) {
        setPhotos(photos.map(p => p.id === photo.id ? { ...p, isFeatured: !p.isFeatured } : p))
      }
    } catch (error) {
      console.error("Error toggling featured:", error)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">作品管理</h1>
          <p className="text-gray-400">上传、编辑和管理你的摄影作品</p>
        </div>
        <Button
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
        >
          + 上传作品
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">加载中...</div>
      ) : photos.length === 0 ? (
        <div className="text-center py-20 bg-gray-800 rounded-xl border border-gray-700">
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-xl font-semibold mb-2">暂无作品</h3>
          <p className="text-gray-400 mb-6">上传你的第一张摄影作品吧！</p>
          <Button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            上传作品
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 group">
              <div className="relative aspect-square">
                <Image
                  src={photo.imageUrl}
                  alt={photo.title || ""}
                  fill
                  className="object-cover"
                  sizes="250px"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant={photo.isFeatured ? "default" : "secondary"}
                    onClick={() => toggleFeatured(photo)}
                    className={photo.isFeatured ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                  >
                    {photo.isFeatured ? "⭐ 已精选" : "☆ 精选"}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setEditingPhoto(photo)}
                  >
                    编辑
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deletePhoto(photo.id)}
                  >
                    删除
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium truncate">{photo.title || "未命名"}</h3>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                  <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                    {CATEGORIES.find(c => c.id === photo.category)?.name || photo.category}
                  </span>
                  {photo.isFeatured && <span className="text-yellow-500">⭐</span>}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(photo.createdAt).toLocaleDateString("zh-CN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          albums={albums}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false)
            fetchData()
          }}
        />
      )}

      {/* Edit Modal */}
      {editingPhoto && (
        <EditModal
          photo={editingPhoto}
          albums={albums}
          onClose={() => setEditingPhoto(null)}
          onSuccess={() => {
            setEditingPhoto(null)
            fetchData()
          }}
        />
      )}
    </div>
  )
}

function UploadModal({ albums, onClose, onSuccess }: { albums: Album[], onClose: () => void, onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("portrait")
  const [albumId, setAlbumId] = useState("")
  const [description, setDescription] = useState("")
  const [uploading, setUploading] = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    try {
      // Upload file
      const formData = new FormData()
      formData.append("file", file)
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
      const uploadData = await uploadRes.json()

      if (!uploadRes.ok) throw new Error(uploadData.error)

      // Create photo record
      const photoRes = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          imageUrl: uploadData.url,
          thumbnailUrl: uploadData.url,
          category,
          albumId: albumId || null,
          isFeatured: false,
        }),
      })

      if (!photoRes.ok) throw new Error("Failed to create photo")

      onSuccess()
    } catch (error) {
      console.error("Upload error:", error)
      alert("上传失败：" + (error as Error).message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold">上传作品</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">选择图片</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                  <button
                    type="button"
                    onClick={() => { setFile(null); setPreview(null) }}
                    className="mt-4 text-red-400 hover:text-red-300 text-sm"
                  >
                    重新选择
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-4">📁</div>
                  <p className="text-gray-400 mb-4">拖拽图片到此处或点击选择</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer"
                  >
                    选择文件
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="作品标题"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">分类</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Album */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">专辑（可选）</label>
            <select
              value={albumId}
              onChange={(e) => setAlbumId(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">无</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>{album.title}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="作品描述（可选）"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              取消
            </Button>
            <Button
              type="submit"
              disabled={!file || uploading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
            >
              {uploading ? "上传中..." : "上传"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EditModal({ photo, albums, onClose, onSuccess }: { photo: Photo, albums: Album[], onClose: () => void, onSuccess: () => void }) {
  const [title, setTitle] = useState(photo.title || "")
  const [category, setCategory] = useState(photo.category)
  const [albumId, setAlbumId] = useState(photo.album?.id || "")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/photos/${photo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...photo,
          title,
          category,
          albumId: albumId || null,
          description,
        }),
      })
      if (res.ok) onSuccess()
      else throw new Error("Failed to update")
    } catch (error) {
      console.error("Update error:", error)
      alert("保存失败")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold">编辑作品</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image src={photo.imageUrl} alt="" fill className="object-cover" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">分类</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">专辑</label>
            <select
              value={albumId}
              onChange={(e) => setAlbumId(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="">无</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>{album.title}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">取消</Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-blue-500 hover:bg-blue-600">
              {saving ? "保存中..." : "保存"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
