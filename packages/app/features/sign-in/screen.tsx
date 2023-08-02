import { YStack } from '@t4/ui'
import { signIn } from 'app/utils/supabase'
import { useRouter } from 'solito/router'
import { SignUpSignInComponent } from '@t4/ui/src/SignUpSignIn'
import { Provider } from '@supabase/supabase-js'
import { signInWithOAuth } from 'app/utils/supabase/auth'

export const SignInScreen = (): React.ReactNode => {
  const { push } = useRouter()

  const handleOAuthSignInWithPress = async (provider: Provider) => {
    const { error } = await signInWithOAuth({
      provider: provider,
      options: { scopes: 'read:user user:email' },
    })

    if (error) {
      // TODO: Tamagui Toast
      console.log('OAuth Sign in failed', error)
      return
    }

    push('/')
  }

  const handleEmailSignInWithPress = async (emailAddress: string, password: string) => {
    const { error } = await signIn(emailAddress, password)

    if (error) {
      // TODO: Tamagui Toast
      console.log('Sign in failed', error)
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
