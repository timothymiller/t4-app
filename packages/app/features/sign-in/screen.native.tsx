import { YStack, useToastController } from '@t4/ui'
import { SignUpSignInComponent } from 'app/features/sign-in/SignUpSignIn'
import { useRouter } from 'solito/router'
import type { Provider } from '@supabase/supabase-js'
import Constants from 'expo-constants'
import { capitalizeWord } from 'app/utils/string'
import { isExpoGo } from 'app/utils/flags'
import { useSupabase } from 'app/utils/supabase/hooks/useSupabase'
import * as WebBrowser from 'expo-web-browser'
import { getInitialURL } from 'expo-linking'
import { Platform } from 'react-native'
import { initiateAppleSignIn } from 'app/utils/auth/appleAuth'
import { useSignIn } from 'app/utils/auth'
import { AuthProviderName } from '@t4/api/src/auth/shared'

export const SignInScreen = (): React.ReactNode => {
  const { push } = useRouter()
  const { signIn } = useSignIn()
  const toast = useToastController()
  const { signIn } = useSignIn()
  const signInWithApple = async () => {
    try {
      const { token, nonce } = await initiateAppleSignIn()
      const res = await signIn({ provider: 'apple', token, nonce })
    } catch (e) {
      if (typeof e === 'object' && !!e && 'code' in e) {
        if (e.code === 'ERR_REQUEST_CANCELED') {
          toast.show('Canceled')
        } else {
          toast.show('Error')
          // handle other errors
        }
      } else {
        console.error('Unexpected error from Apple SignIn: ', e)
      }
    }
  }

  const handleOAuthWithWeb = async (provider: AuthProviderName) => {
    // FIXME hmm... probably could to host a screen with nextjs to handle this

    try {
      const res = await signIn({ provider })
      const redirectUri = (await getInitialURL()) || 't4://'
      const response = await WebBrowser.openAuthSessionAsync(
        `${process.env.NEXT_PUBLIC_APP_URL}/oauth?provider=${provider}&redirect_to=${redirectUri}`,
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
              replace('/')
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

  const handleOAuthSignInWithPress = async (provider: Provider) => {
    if (provider === 'apple' && Platform.OS === 'ios') {
      // use native sign in with apple in ios
      await signInWithApple()
    } else {
      // use web sign in with other providers
      await handleOAuthWithWeb(provider)
    }
  }

  const handleEmailSignInWithPress = async (email: string, password: string) => {
    try {
      await signIn({
        email,
        password,
      })
    } catch (error) {
      toast.show('Sign in failed', {
        description: error.message,
      })
      console.log('Sign in failed', error)
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
