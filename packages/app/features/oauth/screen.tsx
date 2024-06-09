'use client'

import type { AuthProviderName } from '@t4/api/src/auth/providers'
import { Paragraph } from '@t4/ui'
import { type SignInWithOAuth, useSignIn } from 'app/utils/auth'
import { useCallback, useEffect, useRef } from 'react'
import { useSearchParams, useUpdateSearchParams } from 'solito/navigation'
import { P, match } from 'ts-pattern'

type Params = {
  provider: AuthProviderName
  redirectTo: string
  code?: string
  state?: string
  error?: string
}

export interface OAuthSignInScreenProps {
  appleUser?: { email?: string | null } | null
}

export const OAuthSignInScreen = ({ appleUser }: OAuthSignInScreenProps): React.ReactNode => {
  const sent = useRef(false)
  const { signIn } = useSignIn()
  const searchParams = useSearchParams<Params>()
  const updateParams = useUpdateSearchParams<Params>()
  const provider = (searchParams?.get('provider') || undefined) as Params['provider'] | undefined
  const redirectTo = searchParams?.get('redirectTo') || undefined
  const state = searchParams?.get('state') || undefined
  const code = searchParams?.get('code') || undefined
  const error = searchParams?.get('error') || undefined

  const sendApiRequestOnLoad = useCallback(
    async (params: SignInWithOAuth) => {
      if (sent.current) return
      sent.current = true
      try {
        const res = await signIn(params)
        if (!res?.redirectTo) {
          if (params.redirectTo) {
            window.location.href = params.redirectTo
          }
        } else {
          window.location.href = res.redirectTo
        }
      } catch (error) {
        if (params.redirectTo) {
          window.location.href = `${params.redirectTo}#oauth-failed`
        } else {
          window.location.href = '/sign-in#oauth-failed'
        }
        updateParams({ error: 'Sign in failed' })
      }
    },
    [signIn]
  )

  useEffect(() => {
    if (sent.current) return
    if (!provider) return
    sendApiRequestOnLoad({
      provider,
      redirectTo,
      state: state,
      code: code,
      // undefined vs null is a result of passing via JSON with getServerSideProps
      // Maybe there's a superjson plugin or another way to handle it.
      appleUser: appleUser
        ? {
            email: appleUser.email || undefined,
          }
        : undefined,
    })
  }, [provider, redirectTo, state, code, sendApiRequestOnLoad, appleUser])

  const message = match([error, code])
    .with([undefined, P._], () => 'Signing in...')
    .with([undefined, undefined], () => 'Redirecting to sign in...')
    .with([P.string, P.any], () => 'Sign in failed. Please try again.')
    .exhaustive()

  return <Paragraph p='$8'>{message}</Paragraph>
}
