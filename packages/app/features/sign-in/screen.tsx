import { YStack } from '@t4/ui'
import { useSignIn } from 'app/utils/clerk'
import { OAuthStrategy } from '@clerk/types'
import { useRouter } from 'solito/router'
import { SignUpSignInComponent } from '@t4/ui/src/SignUpSignIn'
import { handleOAuthSignIn } from 'app/utils/auth'

export const SignInScreen = (): React.ReactNode => {
  const { push } = useRouter()

  const { isLoaded, signIn, setSession } = useSignIn()
  if (!setSession) return null
  if (!isLoaded) return null

  const redirectIfSignedIn = async () => {
    if (signIn.status == 'complete') {
      push('/')
    }
  }

  const handleOAuthSignInWithPress = async (strategy: OAuthStrategy) => {
    await handleOAuthSignIn(strategy, setSession, signIn)
    await redirectIfSignedIn()
  }

  const handleEmailSignInWithPress = async (emailAddress, password) => {
    const result = await signIn.create({
      identifier: emailAddress,
      password,
    })
    if (result.status === 'complete') {
      setSession(result.createdSessionId)
      await redirectIfSignedIn()
    } else {
      console.log('sign in failed', result)
    }
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
