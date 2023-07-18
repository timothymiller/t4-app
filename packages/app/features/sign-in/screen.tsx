import { YStack } from '@t4/ui'
import { signIn } from 'app/utils/supabase'
import { useRouter } from 'solito/router'
import { SignUpSignInComponent } from '@t4/ui/src/SignUpSignIn'
import { Provider, SignInWithOAuthCredentials } from '@supabase/supabase-js'
import { signInWithOAuth } from 'app/utils/supabase/auth'

export const SignInScreen = (): React.ReactNode => {
  const { push } = useRouter()

  const OAUTH_CREDENTIALS: Record<Provider, SignInWithOAuthCredentials> = {
    // Verified providers
    apple: { provider: 'apple' },
    google: {
      provider: 'google',
      options: { queryParams: { access_type: 'offline', prompt: 'consent' } },
    },
    discord: { provider: 'discord' },
    // Unverified providers
    twitter: { provider: 'twitter' },
    github: { provider: 'github' },
    gitlab: { provider: 'gitlab' },
    facebook: { provider: 'facebook' },
    bitbucket: { provider: 'bitbucket' },
    twitch: { provider: 'twitch' },
    keycloak: { provider: 'keycloak' },
    linkedin: { provider: 'linkedin' },
    notion: { provider: 'notion' },
    slack: { provider: 'slack' },
    spotify: { provider: 'spotify' },
    zoom: { provider: 'zoom' },
    azure: { provider: 'azure' },
    workos: { provider: 'workos' },
  }

  const handleOAuthSignInWithPress = async (provider: Provider) => {
    const { error } = await signInWithOAuth({ provider: provider })

    if (error) {
      console.log('OAuth Sign in failed', error)
      return
    }

    push('/')
  }

  const handleEmailSignInWithPress = async (emailAddress, password) => {
    const res = await signIn(emailAddress, password)

    if (res.error) {
      console.log('Sign in failed', res.error)
      return
    }

    push('/')
  }

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" space>
      <SignUpSignInComponent
        type="sign-in"
        handleOAuthWithPress={handleOAuthSignInWithPress}
        handleEmailWithPress={handleEmailSignInWithPress}
      />
    </YStack>
  )
}
