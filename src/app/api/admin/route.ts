import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// POST create initial admin user
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst()
    
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json({
      success: true,
      admin: { id: admin.id, email: admin.email },
    })
  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json({ error: "Failed to create admin" }, { status: 500 })
  }
}

// GET check if admin exists
export async function GET() {
  try {
    const adminCount = await prisma.admin.count()
    return NextResponse.json({ hasAdmin: adminCount > 0 })
  } catch (error) {
    console.error("Error checking admin:", error)
    return NextResponse.json({ error: "Failed to check admin" }, { status: 500 })
  }
}
