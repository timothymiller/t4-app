import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  if (request.method === 'POST' && request.body) {
    try {
      const cloned = request.clone()
      const requestHeaders = new Headers(request.headers)
      const formData = await cloned.formData()
      const userJson = formData.get('user')
      if (typeof userJson === 'string') {
        requestHeaders.set('x-apple-user', userJson)
      }
      return NextResponse.next({
        request: {
          // New request headers
          headers: requestHeaders,
        },
      })
    } catch (e: unknown) {
      console.error('error parsing oauth post', e)
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/oauth/apple'],
}
