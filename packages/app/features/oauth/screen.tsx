import { AuthProviderName } from '@t4/api/src/auth/shared'
import { Paragraph } from '@t4/ui'
import { useSignIn } from 'app/utils/auth'
import { useEffect } from 'react'
import { createParam } from 'solito'

const { useParam } = createParam<{ provider: AuthProviderName, redirectTo: string }>()

export const OAuthSignInScreen = (): React.ReactNode => {
  const { signIn } = useSignIn()
  const [provider] = useParam('provider')
  const [redirectTo] = useParam('redirectTo')

  useEffect(() => {
    if (!provider) return
    if (!window) return
    const exec = async () => {
      const res = await signIn({ provider, redirectTo })
      console.log('signIn result', res)
      if (!res?.oauthRedirect) {
        if (redirectTo) {
          window.location.href = redirectTo
        }
      } else {
        window.location.href = res.oauthRedirect
      }
    }
    exec()
  }, [provider])

  return (
    <Paragraph p="$8">Redirecting to sign in...</Paragraph>
  )
}
