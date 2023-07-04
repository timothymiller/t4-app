import { YStack } from '@t4/ui'
// import { useSignUp } from 'app/utils/clerk'
// import { OAuthStrategy } from '@clerk/types'
import { useRouter } from 'solito/router'
import { SignUpSignInComponent } from '@t4/ui/src/SignUpSignIn'
import { signUp } from 'app/utils/supabase'

export function SignUpScreen() {
  const { push } = useRouter()

  // const { isLoaded, signUp, setSession } = useSignUp()

  // if (!setSession || !isLoaded) return null

  // const handleOAuthSignUpWithPress = async (strategy: OAuthStrategy) => {
  //   if (process.env.TAMAGUI_TARGET === 'web') {
  //     push('/sign-up/sso-oauth/' + strategy)
  //   } else {
  //     push('/sso-oauth/' + strategy)
  //   }
  // }

  const handleEmailSignUpWithPress = async (emailAddress, password) => {
    // await signUp.create({
    //   emailAddress,
    //   password,
    // })
    // await signUp.prepareEmailAddressVerification()
    // if (process.env.TAMAGUI_TARGET === 'web') {
    //   push('/sign-up/email-verification')
    // } else {
    //   push('/email-verification')
    // }

    const res = await signUp(emailAddress, password)

    if (res.error) {
      console.log('Sign up failed', res.error)
      return
    }

    push('/')
  }

  return (
    <YStack f={1} jc="center" ai="center" space>
      <SignUpSignInComponent
        type="sign-up"
        // handleOAuthWithPress={handleOAuthSignUpWithPress}
        handleEmailWithPress={handleEmailSignUpWithPress}
      />
    </YStack>
  )
}
