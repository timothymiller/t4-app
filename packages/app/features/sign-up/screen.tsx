import { AuthProviderName } from '@t4/api/src/auth/shared'
import { YStack, useToastController } from '@t4/ui'
import { TRPCClientError } from '@trpc/client'
import { SignUpSignInComponent } from 'app/features/sign-in/SignUpSignIn'
import { useSessionRedirect, useSignIn, useSignUp } from 'app/utils/auth'
import { isExpoGo } from 'app/utils/flags'
import { capitalizeWord } from 'app/utils/string'
import { useRouter } from 'solito/router'

export const SignUpScreen = (): React.ReactNode => {
  const { push } = useRouter()
  const toast = useToastController()
  const { signIn } = useSignIn()
  const { signUp } = useSignUp()

  // TODO maybe manage this state and pass as props to SignUpSignInComponent
  // const [authenticating, setAuthenticating] = useState(false)
  // const [signUpError, setSignUpError] = useState<string>()

  // Redirect back to the home page if signed in
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
          toast.show(capitalizeWord(provider) + ' sign up failed', {
            description: error.message,
          })
        }
      }
      console.log('OAuth Sign up failed', error)
    }
  }

  const handleEmailSignUpWithPress = async (email: string, password: string) => {
    try {
      await signUp({
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
          toast.show('Sign up failed', {
            description: error.message,
          })
        }
      }
      console.log('Sign up failed', error)
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
