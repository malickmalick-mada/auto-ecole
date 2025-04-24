import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    return
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (!token) return false

        // Allow access to admin routes only for admin users
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token.role === "ADMIN"
        }

        // Allow authenticated users to access other protected routes
        return true
      }
    }
  }
)

export const config = {
  matcher: [
    "/chat/:path*", 
    "/quizz/:path*", 
    "/cours/:path*",
    "/admin/:path*"
  ]
}