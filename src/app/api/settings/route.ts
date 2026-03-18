import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

// GET site settings
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "settings" },
    })

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          siteTitle: "xPhotoAlbum",
          siteDescription: "Photography Portfolio",
          featuredCount: 12,
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

// PUT update site settings
export async function PUT(request: Request) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { heroImage, featuredCount, siteTitle, siteDescription } = body

    const settings = await prisma.siteSettings.upsert({
      where: { id: "settings" },
      create: {
        heroImage,
        featuredCount,
        siteTitle,
        siteDescription,
      },
      update: {
        heroImage,
        featuredCount,
        siteTitle,
        siteDescription,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
