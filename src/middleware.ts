import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const session = await auth()
  
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
