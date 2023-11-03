import type { AuthProviderName } from '@t4/api/src/auth/providers'
import { YStack, useToastController } from '@t4/ui'
import { SignUpSignInComponent } from 'app/features/sign-in/SignUpSignIn'
import { useSessionRedirect, useSignIn } from 'app/utils/auth'
import { initiateAppleSignIn } from 'app/utils/auth/appleAuth'
import { storeSessionToken } from 'app/utils/auth/credentials'
import { isExpoGo } from 'app/utils/flags'
import { capitalizeWord } from 'app/utils/string'
import { trpc } from 'app/utils/trpc'
import { getInitialURL } from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { Platform } from 'react-native'

export const SignInScreen = (): React.ReactNode => {
  const toast = useToastController()
  const utils = trpc.useUtils()
  const { signIn } = useSignIn()

  // Redirects back to the home page if signed in
  useSessionRedirect({ true: '/' })

  const postLogin = () => {
    utils.user.invalidate()
    utils.auth.invalidate()
  }

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
    try {
      const redirectUri = (await getInitialURL()) || 't4://'
      const response = await WebBrowser.openAuthSessionAsync(
        process.env.EXPO_PUBLIC_APP_URL + '/oauth/' + provider,
        redirectUri
      )
      if (response.type === 'success') {
        const url = response.url
        const params = new URLSearchParams(url.split('#')[1])
        const token = params.get('token') || ''
        if (token) {
          storeSessionToken(token)
          postLogin()
        }
      }
    } catch (error) {
      toast.show(capitalizeWord(provider) + ' sign in failed', {
        description: 'Something went wrong, please try again.',
      })
    } finally {
      WebBrowser.maybeCompleteAuthSession()
    }
  }

  const handleOAuthSignInWithPress = async (provider: AuthProviderName) => {
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
