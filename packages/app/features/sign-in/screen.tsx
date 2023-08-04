import { YStack, useToastController } from '@t4/ui'
import { signIn } from 'app/utils/supabase'
import { useRouter } from 'solito/router'
import { SignUpSignInComponent } from '@t4/ui/src/SignUpSignIn'
import { Provider } from '@supabase/supabase-js'
import { signInWithOAuth } from 'app/utils/supabase/auth'
import Constants from 'expo-constants'
import { capitalizeWord } from 'app/utils/string'
import { isExpoGo } from 'app/utils/flags'

export const SignInScreen = (): React.ReactNode => {
  const toast = useToastController()
  const { push } = useRouter()

  const handleOAuthSignInWithPress = async (provider: Provider) => {
    const { error } = await signInWithOAuth({
      provider: provider,
      options: { scopes: 'read:user user:email' },
    })

    if (error) {
      if (!isExpoGo) {
        toast.show(capitalizeWord(provider) + ' sign in failed', {
          description: error.message,
        })
      }
      console.log('OAuth Sign in failed', error)
      return
    }

    push('/')
  }

  const handleEmailSignInWithPress = async (emailAddress: string, password: string) => {
    const { error } = await signIn(emailAddress, password)

    if (error) {
      const isExpoGo = Constants.appOwnership === 'expo'
      if (!isExpoGo) {
        toast.show('Sign in failed', {
          description: error.message,
        })
      }
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
