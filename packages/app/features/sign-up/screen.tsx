import { YStack, useToastController } from '@t4/ui'
import { useRouter } from 'solito/router'
import { SignUpSignInComponent } from '@t4/ui/src/SignUpSignIn'
import type { Provider } from '@supabase/supabase-js'
import { capitalizeWord } from 'app/utils/string'
import { isExpoGo } from 'app/utils/flags'
import { useSupabase } from 'app/utils/supabase/hooks/useSupabase'

export const SignUpScreen = (): React.ReactNode => {
  const { push } = useRouter()
  const toast = useToastController()
  const supabase = useSupabase()

  const handleOAuthSignInWithPress = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options:
        provider === 'google'
          ? {
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              },
            }
          : {},
    })
    if (error) {
      if (!isExpoGo) {
        toast.show(capitalizeWord(provider) + ' sign up failed', {
          description: error.message,
        })
      }
      return
    }
    push('/')
  }

  const handleEmailSignUpWithPress = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      if (!isExpoGo) {
        console.log('error', error)
        toast.show('Sign up failed', {
          message: error.message,
        })
      }
    } else if (data?.user) {
      if (!isExpoGo) {
        toast.show('Email Confirmation', {
          message: 'Check your email ',
        })
      }
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
