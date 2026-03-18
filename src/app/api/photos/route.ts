import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

// GET all photos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const albumId = searchParams.get("albumId")
    const featured = searchParams.get("featured")
    const category = searchParams.get("category")

    const where: any = {}
    
    if (albumId) {
      where.albumId = albumId
    }
    
    if (featured === "true") {
      where.isFeatured = true
    }
    
    if (category && category !== "all") {
      where.category = category
    }

    const photos = await prisma.photo.findMany({
      where,
      include: {
        album: true,
      },
      orderBy: {
        order: "asc",
      },
    })

    return NextResponse.json(photos)
  } catch (error) {
    console.error("Error fetching photos:", error)
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 })
  }
}

// POST create new photo
export async function POST(request: Request) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, imageUrl, thumbnailUrl, albumId, category, isFeatured, order, exif } = body

    const photo = await prisma.photo.create({
      data: {
        title,
        description,
        imageUrl,
        thumbnailUrl,
        albumId,
        category: category || "uncategorized",
        isFeatured: isFeatured || false,
        order: order || 0,
        exif,
      },
    })

    return NextResponse.json(photo, { status: 201 })
  } catch (error) {
    console.error("Error creating photo:", error)
    return NextResponse.json({ error: "Failed to create photo" }, { status: 500 })
  }
}
