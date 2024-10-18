import { withAuth } from "next-auth/middleware"

export default withAuth(
  
    function middleware(req) {
    console.log(req.nextauth.token)
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if(req.nextUrl.pathname === '/admin'){
            return token?.role === '/admin';
        }
        return Boolean(token)
      }
      }
  },
)
export const config = {
  matcher: ['/Admin', '/Admin/:path*'],
}

