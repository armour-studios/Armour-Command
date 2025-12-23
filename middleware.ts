
import { auth } from "@/auth"

export default auth(() => {
  // Middleware logic is now handled in auth.ts callbacks,
  // but we can add additional logic here if needed.
})

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
