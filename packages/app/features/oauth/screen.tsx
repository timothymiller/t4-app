import type { AuthProviderName } from '@t4/api/src/auth/providers'
import { Paragraph, isServer } from '@t4/ui'
import { useSignIn } from 'app/utils/auth'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createParam } from 'solito'
import { P, match } from 'ts-pattern'

type Params = { provider: AuthProviderName; redirectTo: string; code?: string; state?: string }

const { useParam } = createParam<Params>()

export const OAuthSignInScreen = (): React.ReactNode => {
  const sent = useRef(false)
  const { signIn } = useSignIn()
  const [provider] = useParam('provider')
  const [redirectTo] = useParam('redirectTo')
  const [state] = useParam('state')
  const [code] = useParam('code')
  const [error, setError] = useState<string | undefined>(undefined)

  const sendApiRequestOnLoad = useCallback(
    async (params: Params) => {
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
    sendApiRequestOnLoad({ provider, redirectTo: redirectTo || '', state, code })
  }, [provider, redirectTo, state, code, sendApiRequestOnLoad])

  const message = match([error, code])
    .with([undefined, P._], () => 'Signing in...')
    .with([undefined, undefined], () => 'Redirecting to sign in...')
    .with([P.string, P.any], () => 'Sign in failed. Please try again.')
    .exhaustive()

  return <Paragraph p='$8'>{message}</Paragraph>
}
