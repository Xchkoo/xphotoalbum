"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Album {
  id: string
  title: string
  description: string | null
  coverImage: string | null
  order: number
  _count?: { photos: number }
}

export default function AdminAlbums() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null)

  useEffect(() => {
    fetchAlbums()
  }, [])

  async function fetchAlbums() {
    try {
      const res = await fetch("/api/albums")
      const data = await res.json()
      setAlbums(data)
    } catch (error) {
      console.error("Error fetching albums:", error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteAlbum(id: string) {
    if (!confirm("确定要删除这个专辑吗？专辑内的作品不会被删除。")) return

    try {
      const res = await fetch(`/api/albums/${id}`, { method: "DELETE" })
      if (res.ok) {
        setAlbums(albums.filter(a => a.id !== id))
      }
    } catch (error) {
      console.error("Error deleting album:", error)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">专辑管理</h1>
          <p className="text-gray-400">创建和管理摄影专辑分类</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
        >
          + 创建专辑
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">加载中...</div>
      ) : albums.length === 0 ? (
        <div className="text-center py-20 bg-gray-800 rounded-xl border border-gray-700">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold mb-2">暂无专辑</h3>
          <p className="text-gray-400 mb-6">创建你的第一个专辑来整理作品吧！</p>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            创建专辑
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <div key={album.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 group">
              <div className="relative aspect-video">
                {album.coverImage ? (
                  <Image
                    src={album.coverImage}
                    alt={album.title}
                    fill
                    className="object-cover"
                    sizes="350px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center text-4xl">
                    📁
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setEditingAlbum(album)}
                  >
                    编辑
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteAlbum(album.id)}
                  >
                    删除
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{album.title}</h3>
                {album.description && (
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{album.description}</p>
                )}
                <p className="text-gray-500 text-sm mt-2">
                  {album._count?.photos || 0} 张作品
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showModal || editingAlbum) && (
        <AlbumModal
          album={editingAlbum}
          onClose={() => {
            setShowModal(false)
            setEditingAlbum(null)
          }}
          onSuccess={() => {
            setShowModal(false)
            setEditingAlbum(null)
            fetchAlbums()
          }}
        />
      )}
    </div>
  )
}

function AlbumModal({ album, onClose, onSuccess }: { album: Album | null, onClose: () => void, onSuccess: () => void }) {
  const [title, setTitle] = useState(album?.title || "")
  const [description, setDescription] = useState(album?.description || "")
  const [coverImage, setCoverImage] = useState(album?.coverImage || "")
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (res.ok) {
        setCoverImage(data.url)
      }
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const url = album ? `/api/albums/${album.id}` : "/api/albums"
      const method = album ? "PUT" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          coverImage,
        }),
      })

      if (res.ok) onSuccess()
      else throw new Error("Failed to save")
    } catch (error) {
      console.error("Save error:", error)
      alert("保存失败")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold">{album ? "编辑专辑" : "创建专辑"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">封面图片</label>
            {coverImage ? (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image src={coverImage} alt="Cover" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                  id="cover-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="cover-upload"
                  className="cursor-pointer text-gray-400 hover:text-gray-300"
                >
                  {uploading ? "上传中..." : "点击上传封面"}
                </label>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">专辑名称 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              rows={3}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              取消
            </Button>
            <Button
              type="submit"
              disabled={saving || !title}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50"
            >
              {saving ? "保存中..." : "保存"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
