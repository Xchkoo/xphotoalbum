import { prisma } from "@/lib/db"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const [photoCount, albumCount, featuredCount] = await Promise.all([
    prisma.photo.count(),
    prisma.album.count(),
    prisma.photo.count({ where: { isFeatured: true } }),
  ])

  const recentPhotos = await prisma.photo.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { album: true },
  })

  const stats = [
    { label: "总作品数", value: photoCount, icon: "📸", color: "bg-blue-500" },
    { label: "专辑数", value: albumCount, icon: "📁", color: "bg-green-500" },
    { label: "精选作品", value: featuredCount, icon: "⭐", color: "bg-yellow-500" },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">仪表盘</h1>
        <p className="text-gray-400">欢迎回来，这是你的摄影作品管理后台</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          href="/admin/photos"
          className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              ➕
            </div>
            <div>
              <h3 className="text-lg font-semibold">上传作品</h3>
              <p className="text-gray-400">添加新的摄影作品</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/albums"
          className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📁
            </div>
            <div>
              <h3 className="text-lg font-semibold">创建专辑</h3>
              <p className="text-gray-400">管理摄影专辑分类</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Photos */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold">最近作品</h2>
        </div>
        <div className="divide-y divide-gray-700">
          {recentPhotos.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              暂无作品，快去上传第一张作品吧！
            </div>
          ) : (
            recentPhotos.map((photo) => (
              <div key={photo.id} className="p-4 flex items-center gap-4 hover:bg-gray-700/50 transition-colors">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                  {photo.imageUrl && (
                    <img src={photo.imageUrl} alt={photo.title || ""} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{photo.title || "未命名"}</p>
                  <p className="text-sm text-gray-400">
                    {photo.category} {photo.album?.title && `· ${photo.album.title}`}
                  </p>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(photo.createdAt).toLocaleDateString("zh-CN")}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
