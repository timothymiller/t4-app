import { YStack } from '@t4/ui'
import { signIn } from 'app/utils/supabase'
// import { OAuthStrategy } from '@clerk/types'
import { useRouter } from 'solito/router'
import { SignUpSignInComponent } from '@t4/ui/src/SignUpSignIn'
import { handleOAuthSignIn } from 'app/utils/auth'
import { Provider, SignInWithOAuthCredentials } from '@supabase/supabase-js'
import { signInWithOAuth } from 'app/utils/supabase/auth'

export function SignInScreen() {
  const { push } = useRouter()

  // const { isLoaded, signIn, setSession } = useSignIn()
  // if (!setSession) return null
  // if (!isLoaded) return null

  const redirectIfSignedIn = async () => {
    // if (signIn.status == 'complete') {
    //   push('/')
    // }
  }
  const OAUTH_CREDENTIALS: Record<Provider, SignInWithOAuthCredentials> = {
    apple: { provider: 'apple' }, // Verified
    google: {
      provider: 'google',
      options: { queryParams: { access_type: 'offline', prompt: 'consent' } },
    }, // verified
    discord: { provider: 'discord' }, // Verified
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
    const res = await signInWithOAuth({ provider: provider })

    if (res.error) {
      console.log('Sign in failed', res.error)
      return
    }

    push('/')

    // await handleOAuthSignIn(strategy, setSession, signIn)
    // await redirectIfSignedIn()
  }

  const handleEmailSignInWithPress = async (emailAddress, password) => {
    // const result = await signIn.create({
    //   identifier: emailAddress,
    //   password,
    // })
    // if (result.status === 'complete') {
    //   setSession(result.createdSessionId)
    //   await redirectIfSignedIn()
    // } else {
    //   console.log('sign in failed', result)
    // }

    const res = await signIn(emailAddress, password)

    if (res.error) {
      console.log('Sign in failed', res.error)
      return
    }

    push('/')
  }

  return (
    <YStack f={1} jc="center" ai="center" space>
      <SignUpSignInComponent
        type="sign-in"
        handleOAuthWithPress={handleOAuthSignInWithPress}
        handleEmailWithPress={handleEmailSignInWithPress}
      />
    </YStack>
  )
}
