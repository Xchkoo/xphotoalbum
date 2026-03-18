import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

// GET all albums
export async function GET() {
  try {
    const albums = await prisma.album.findMany({
      include: {
        _count: {
          select: { photos: true }
        }
      },
      orderBy: {
        order: "asc",
      },
    })

    return NextResponse.json(albums)
  } catch (error) {
    console.error("Error fetching albums:", error)
    return NextResponse.json({ error: "Failed to fetch albums" }, { status: 500 })
  }
}

// POST create new album
export async function POST(request: Request) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, coverImage, order } = body

    const album = await prisma.album.create({
      data: {
        title,
        description,
        coverImage,
        order: order || 0,
      },
    })

    return NextResponse.json(album, { status: 201 })
  } catch (error) {
    console.error("Error creating album:", error)
    return NextResponse.json({ error: "Failed to create album" }, { status: 500 })
  }
}
