import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Initializing database...")
  
  try {
    // Create SiteSettings if not exists
    const settings = await prisma.siteSettings.upsert({
      where: { id: "settings" },
      create: {
        siteTitle: "xPhotoAlbum",
        siteDescription: "Photography Portfolio",
        featuredCount: 12,
      },
      update: {},
    })
    console.log("SiteSettings initialized:", settings.id)
    
    console.log("Database initialization completed!")
  } catch (error) {
    console.error("Error initializing database:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
