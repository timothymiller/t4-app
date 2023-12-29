import type { GetServerSideProps } from 'next'
import type { AuthProviderName } from '@t4/api/src/auth/providers'
import { Paragraph, isServer } from '@t4/ui'
import { type SignInWithOAuth, useSignIn } from 'app/utils/auth'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createParam } from 'solito'
import { P, match } from 'ts-pattern'

type Params = {
  provider: AuthProviderName
  redirectTo: string
  code?: string
  state?: string
}

const { useParam } = createParam<Params>()

// Apple will POST form data to the redirect URI when scopes have been requested
// @link https://developer.apple.com/documentation/sign_in_with_apple/request_an_authorization_to_the_sign_in_with_apple_server
export const getServerSideProps = (async (context) => {
  // Fetch data from external API
  let appleUser = null
  if (context.req.method !== 'POST') {
    return { props: { appleUser } }
  }
  try {
    const userJSON = context.req.headers['x-apple-user'] as string | undefined
    if (typeof userJSON === 'string') {
      appleUser = JSON.parse(userJSON)
    }
  } catch (e: unknown) {
    console.error(e)
  }
  // Pass data to the page via props
  return { props: { appleUser } }
}) satisfies GetServerSideProps<OAuthSignInScreenProps>

export interface OAuthSignInScreenProps {
  appleUser?: { email?: string | null } | null
}

export const OAuthSignInScreen = ({ appleUser }: OAuthSignInScreenProps): React.ReactNode => {
  const sent = useRef(false)
  const { signIn } = useSignIn()
  const [provider] = useParam('provider')
  const [redirectTo] = useParam('redirectTo')
  const [state] = useParam('state')
  const [code] = useParam('code')
  const [error, setError] = useState<string | undefined>(undefined)

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
        setError('Sign in failed')
      }
    },
    [signIn]
  )

  useEffect(() => {
    if (sent.current) return
    if (!provider) return
    sendApiRequestOnLoad({
      provider,
      redirectTo: redirectTo || '',
      state,
      code,
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
