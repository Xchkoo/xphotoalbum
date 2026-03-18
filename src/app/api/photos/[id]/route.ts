import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

// GET single photo
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const photo = await prisma.photo.findUnique({
      where: { id },
      include: {
        album: true,
      },
    })

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 })
    }

    return NextResponse.json(photo)
  } catch (error) {
    console.error("Error fetching photo:", error)
    return NextResponse.json({ error: "Failed to fetch photo" }, { status: 500 })
  }
}

// PUT update photo
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
    const { title, description, imageUrl, thumbnailUrl, albumId, category, isFeatured, order, exif } = body

    const photo = await prisma.photo.update({
      where: { id },
      data: {
        title,
        description,
        imageUrl,
        thumbnailUrl,
        albumId,
        category,
        isFeatured,
        order,
        exif,
      },
    })

    return NextResponse.json(photo)
  } catch (error) {
    console.error("Error updating photo:", error)
    return NextResponse.json({ error: "Failed to update photo" }, { status: 500 })
  }
}

// DELETE photo
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
    await prisma.photo.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting photo:", error)
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 })
  }
}
