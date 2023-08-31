import { YStack, useToastController } from '@t4/ui'
import { SignUpSignInComponent } from '@t4/ui/src/SignUpSignIn'
import { useRouter } from 'solito/router'
import type { Provider } from '@supabase/supabase-js'
import Constants from 'expo-constants'
import { capitalizeWord } from 'app/utils/string'
import { isExpoGo } from 'app/utils/flags'
import { useSupabase } from 'app/utils/supabase/hooks/useSupabase'

export const SignInScreen = (): React.ReactNode => {
  const { replace } = useRouter()
  const supabase = useSupabase()
  const toast = useToastController()

  const handleOAuthSignInWithPress = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
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

    replace('/')
  }

  const handleEmailSignInWithPress = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) {
      const isExpoGo = Constants.appOwnership === 'expo'
      if (!isExpoGo) {
        toast.show('Sign in failed', {
          description: error.message,
        })
      }
      return
    }

    replace('/')
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
