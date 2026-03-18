import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com"
  const password = process.env.ADMIN_PASSWORD || "Admin123!@#"

  // Check if admin exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  })

  if (existingAdmin) {
    console.log("Admin already exists:", email)
    return
  }

  // Create admin
  const hashedPassword = await bcrypt.hash(password, 12)
  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
    },
  })

  console.log("Admin created successfully!")
  console.log("Email:", email)
  console.log("Password:", password)
  console.log("\n⚠️  Please change the password after first login!")
}

main()
  .catch((e) => {
    console.error("Error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
