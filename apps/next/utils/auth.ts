import jwt from '@tsndr/cloudflare-worker-jwt'
import type { GetServerSidePropsContext } from 'next/types'
import { Session, createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { secureCookieOptions } from 'app/utils/supabase/cookies'

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
