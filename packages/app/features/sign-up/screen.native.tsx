import { YStack, useToastController } from '@t4/ui'
import { SignUpSignInComponent } from 'app/features/sign-in/SignUpSignIn'
import { useRouter } from 'solito/router'
import { emailPasswordSignUp } from 'supertokens-web-js/recipe/thirdpartyemailpassword'
import { handleOAuthSignInWithPress } from '../oauth/utils.native'
import { OAuthProvider } from '../oauth/type'

export const SignUpScreen = (): React.ReactNode => {
  const router = useRouter()
  const toast = useToastController()

  const handleEmailSignUpWithPress = async (email: string, password: string) => {
    try {
      const response = await emailPasswordSignUp({
        formFields: [
          {
            id: 'email',
            value: email,
          },
          {
            id: 'password',
            value: password,
          },
        ],
      })

      if (response.status === 'FIELD_ERROR') {
        // one of the input formFields failed validaiton
        for (const formField of response.formFields) {
          toast.show(`${formField.id}:  ${formField.error}`)
        }
      } else if (response.status === 'SIGN_UP_NOT_ALLOWED') {
        // this can happen during automatic account linking. Tell the user to use another
        // login method, or go through the password reset flow.
        toast.show('Use another login method or go through the password reset flow!')
      } else {
        // sign up successful. The session tokens are automatically handled by
        // the frontend SDK.
        router.replace('/')
      }
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        // this may be a custom error message sent from the API by you.
        toast.show(err.message)
      } else {
        toast.show('Oops! Something went wrong.')
      }
    }
  }

  return (
    <YStack flex={1} justifyContent='center' alignItems='center' space>
      <SignUpSignInComponent
        type='sign-up'
        handleOAuthWithPress={(provider: OAuthProvider) =>
          handleOAuthSignInWithPress({ provider, toast, router })
        }
        handleEmailWithPress={handleEmailSignUpWithPress}
      />
    </YStack>
  )
}
