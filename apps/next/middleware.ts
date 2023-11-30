import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from '@tsndr/cloudflare-worker-jwt'

export async function middleware(req: NextRequest) {
  console.log('middleware')

  const email = await getEmailFromCookie(req, 'auth-token')
  if (email === undefined) {
    return NextResponse.redirect('https://t4stack.com/sign-in')
  }

  // TODO: Check email is $50 donor tier
  // const isDonor = false
  // if (!isDonor) {
  //   return NextResponse.redirect(
  //     'https://github.com/sponsors/timothymiller/sponsorships?sponsor=timothymiller&tier_id=40008&preview=false'
  //   )
  // }
  const res = NextResponse.next()
  return res
}

async function getEmailFromCookie(
  req: NextRequest,
  sessionTokenKey: string
): Promise<string | undefined> {
  const JWT_VERIFICATION_KEY = process.env.JWT_VERIFICATION_KEY
  if (!JWT_VERIFICATION_KEY) {
    console.error('JWT_VERIFICATION_KEY is not set')
    return
  }

  try {
    const sessionToken = req.cookies.get(sessionTokenKey)?.value
    if (sessionToken === undefined) {
      return
    }
    const authorized = await jwt.verify(sessionToken, JWT_VERIFICATION_KEY, {
      algorithm: 'HS256',
    })
    if (authorized === false) {
      return
    }

    const decodedToken = jwt.decode(sessionToken)

    // Check if token is expired
    const expirationTimestamp = decodedToken.payload.exp
    const currentTimestamp = Math.floor(Date.now() / 1000)
    if (!expirationTimestamp || expirationTimestamp < currentTimestamp) {
      return
    }

    const email = decodedToken?.payload?.email
    if (!email) {
      return
    }
    return email as string
  } catch (e) {
    console.error(e)
    return
  }
}
