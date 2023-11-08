import { Session, createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import jwt from '@tsndr/cloudflare-worker-jwt'
import { secureCookieOptions } from 'app/utils/supabase/cookies'
import type { GetServerSidePropsContext } from 'next/types'

export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const authorized = await jwt.verify(token, process.env.JWT_VERIFICATION_KEY as string, {
      algorithm: 'HS256',
    })
    return authorized as boolean
  } catch (e) {
    console.error(e)
    return false
  }
}

export const getSession = async (ctx: GetServerSidePropsContext): Promise<Session | null> => {
  const supabase = createPagesServerClient(ctx, {
    cookieOptions: secureCookieOptions,
  })
  const supabaseResponse = await supabase.auth.getSession()
  return supabaseResponse?.data.session
}
