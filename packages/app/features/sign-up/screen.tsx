import { YStack, useToastController } from '@t4/ui'
import { useRouter } from 'solito/router'
import { SignUpSignInComponent } from '@t4/ui/src/SignUpSignIn'
import { signUp } from 'app/utils/supabase'
import type { Provider } from '@supabase/supabase-js'
import { signInWithOAuth } from 'app/utils/supabase/auth'
import { capitalizeWord } from 'app/utils/string'
import { isExpoGo } from 'app/utils/flags'

export const SignUpScreen = (): React.ReactNode => {
  const { push } = useRouter()
  const toast = useToastController()

  const handleOAuthSignInWithPress = async (provider: Provider) => {
    const { error } = await signInWithOAuth({ provider: provider })

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

  const handleEmailSignUpWithPress = async (emailAddress: string, password: string) => {
    const { user, error } = await signUp(emailAddress, password)
    if (error) {
      if (!isExpoGo) {
        toast.show('Sign up failed', {
          description: error.message,
        })
      }
    } else if (user) {
      if (!isExpoGo) {
        toast.show('Email Confirmation Link', {
          description: 'Check your email for a confirmation link.',
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
