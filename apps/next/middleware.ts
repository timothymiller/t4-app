import { NextApiHandler } from 'next'
import { getUser } from 'app/utils/supabase'

type PublicRoute =
  | '/'
  | '/infinite-list'
  | '/infinite-list-unoptimized'
  | '/params'
  | '/data-fetching'

const publicRoutes: PublicRoute[] = [
  '/',
  '/infinite-list',
  '/infinite-list-unoptimized',
  '/params',
  '/data-fetching',
]

const isPublicRoute = (route: string): route is PublicRoute => {
  return publicRoutes.includes(route as PublicRoute)
}

const authMiddleware =
  (handler: NextApiHandler): NextApiHandler =>
  async (req, res) => {
    if (typeof req.url === 'string' && isPublicRoute(req.url)) {
      return handler(req, res)
    }
    const user = await getUser()

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    return handler(req, res)
  }

export default authMiddleware

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/'],
}
