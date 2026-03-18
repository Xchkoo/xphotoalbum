import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

// GET single album
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const album = await prisma.album.findUnique({
      where: { id },
      include: {
        photos: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: { photos: true }
        }
      },
    })

    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 })
    }

    return NextResponse.json(album)
  } catch (error) {
    console.error("Error fetching album:", error)
    return NextResponse.json({ error: "Failed to fetch album" }, { status: 500 })
  }
}

// PUT update album
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, coverImage, order } = body

    const album = await prisma.album.update({
      where: { id },
      data: {
        title,
        description,
        coverImage,
        order,
      },
    })

    return NextResponse.json(album)
  } catch (error) {
    console.error("Error updating album:", error)
    return NextResponse.json({ error: "Failed to update album" }, { status: 500 })
  }
}

// DELETE album
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    await prisma.album.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting album:", error)
    return NextResponse.json({ error: "Failed to delete album" }, { status: 500 })
  }
}
