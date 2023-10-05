import { YStack, useToastController } from '@t4/ui'
import { useRouter } from 'solito/router'
import { SignUpSignInComponent } from '@t4/ui/src/SignUpSignIn'
import type { Provider } from '@supabase/supabase-js'
import { capitalizeWord } from 'app/utils/string'
import { isExpoGo } from 'app/utils/flags'
import { useSupabase } from 'app/utils/supabase/hooks/useSupabase'
import * as WebBrowser from 'expo-web-browser'
import { getInitialURL } from 'expo-linking'

export const SignUpScreen = (): React.ReactNode => {
  const { push } = useRouter()
  const toast = useToastController()
  const supabase = useSupabase()

  const handleOAuthSignInWithPress = async (provider: Provider) => {
    try {
      const redirectUri = (await getInitialURL()) || 't4://'
      const response = await WebBrowser.openAuthSessionAsync(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${redirectUri}`,
        redirectUri
      )
      if (response.type === 'success') {
        const url = response.url
        const params = new URLSearchParams(url.split('#')[1])
        const accessToken = params.get('access_token') || ''
        const refreshToken = params.get('refresh_token') || ''
        await supabase.auth
          .setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          .then(({ data: { session }, error }) => {
            if (session) {
              // @ts-ignore set session does not call subscribers when session is updated
              supabase.auth._notifyAllSubscribers('SIGNED_IN', session)
              push('/')
            } else {
              if (!isExpoGo) {
                toast.show(capitalizeWord(provider) + ' sign in failed', {
                  description: error?.message || 'Something went wrong, please try again.',
                })
              }
              console.log('Supabase session error:', error)
            }
          })
      }
    } catch (error) {
      toast.show(capitalizeWord(provider) + ' sign in failed', {
        description: 'Something went wrong, please try again.',
      })
    } finally {
      WebBrowser.maybeCompleteAuthSession()
    }
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
