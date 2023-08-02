import { YStack } from '@t4/ui'
import { useRouter } from 'solito/router'
import { SignUpSignInComponent } from '@t4/ui/src/SignUpSignIn'
import { signUp } from 'app/utils/supabase'
import type { Provider } from '@supabase/supabase-js'
import { signInWithOAuth } from 'app/utils/supabase/auth'

export const SignUpScreen = (): React.ReactNode => {
  const { push } = useRouter()

  const handleOAuthSignInWithPress = async (provider: Provider) => {
    const { error } = await signInWithOAuth({ provider: provider })

    if (error) {
      // TODO: Tamagui Toast
      console.log('OAuth Sign in failed', error)
      return
    }

    push('/')
  }

  const handleEmailSignUpWithPress = async (emailAddress: string, password: string) => {
    const { user, error } = await signUp(emailAddress, password)
    if (error) {
      // TODO: Handle error state Tamagui Toast
      console.log('Sign up failed', error)
      alert('Sign up failed')
    } else if (user) {
      // TODO: Make own page for this
      alert('Check your email for a confirmation link.')
      push('/')
    }
  }

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" space>
      <SignUpSignInComponent
        type="sign-up"
        handleOAuthWithPress={handleOAuthSignInWithPress}
        handleEmailWithPress={handleEmailSignUpWithPress}
      />
    </YStack>
  )
}
