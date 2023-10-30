import type { AuthProviderName } from '@t4/api/src/auth/shared'
import { YStack, useToastController } from '@t4/ui'
import { TRPCClientError } from '@trpc/client'
import { SignUpSignInComponent } from 'app/features/sign-in/SignUpSignIn'
import { useSessionRedirect, useSignIn } from 'app/utils/auth'
import { isExpoGo } from 'app/utils/flags'
import { capitalizeWord } from 'app/utils/string'
import { useRouter } from 'solito/router'

export const SignInScreen = (): React.ReactNode => {
  const toast = useToastController()
  const { push } = useRouter()
  const { signIn } = useSignIn()

  // Redirects back to the home page if signed in
  useSessionRedirect({ true: '/' })

  const handleOAuthSignInWithPress = async (provider: AuthProviderName) => {
    try {
      const res = await signIn({
        provider,
      })
      if (res?.oauthRedirect) {
        push(res.oauthRedirect)
      }
    } catch (error) {
      if (
        error instanceof TRPCClientError &&
        error.data?.httpStatus &&
        error.data.httpStatus < 500
      ) {
        if (!isExpoGo) {
          toast.show(error.message)
        }
      } else {
        if (!isExpoGo) {
          toast.show(capitalizeWord(provider) + ' sign in failed', {
            description: error.message,
          })
        }
      }
      console.log('OAuth Sign in failed', error)
    }
  }

  const handleEmailSignInWithPress = async (email: string, password: string) => {
    try {
      await signIn({
        email,
        password,
      })
    } catch (error) {
      if (
        error instanceof TRPCClientError &&
        error.data?.httpStatus &&
        error.data.httpStatus < 500
      ) {
        if (!isExpoGo) {
          toast.show(error.message)
        }
      } else {
        if (!isExpoGo) {
          toast.show('Sign in failed', {
            description: error.message,
          })
        }
      }
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
