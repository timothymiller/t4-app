import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Apple will POST form data to the redirect URI when scopes have been requested
// This middleware enables getting the posted form data out of the request body
// and sets it as JSON to a custom header which is then extracted in the
// pages/oauth/[provider].tsx route component's getServerSideProps function
// @link https://developer.apple.com/documentation/sign_in_with_apple/request_an_authorization_to_the_sign_in_with_apple_server
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
