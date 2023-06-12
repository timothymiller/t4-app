import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ['/', '/infinite-list', '/infinite-list-unoptimized', '/params', '/data-fetching'],
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/'],
}
