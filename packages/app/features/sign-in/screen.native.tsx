import { YStack, useToastController } from '@t4/ui'
import { SignUpSignInComponent } from 'app/features/sign-in/SignUpSignIn'
import { useRouter } from 'solito/router'
import { emailPasswordSignIn } from 'supertokens-web-js/recipe/thirdpartyemailpassword'

export const SignInScreen = (): React.ReactNode => {
  const { replace } = useRouter()
  const toast = useToastController()

  const handleOAuthSignInWithPress = async (provider: string) => {
    toast.show(`Sign in with ${provider} is not supported yet.`)
  }

  const handleEmailSignInWithPress = async (email: string, password: string) => {
    try {
      let response = await emailPasswordSignIn({
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
        response.formFields.forEach((formField) => {
          if (formField.id === 'email') {
            // Email validation failed (for example incorrect email syntax).
            toast.show(formField.error)
          }
        })
      } else if (response.status === 'WRONG_CREDENTIALS_ERROR') {
        // window.alert("Email password combination is incorrect.")
        toast.show('Email password combination is incorrect.')
      } else if (response.status === 'SIGN_IN_NOT_ALLOWED') {
        // this can happen due to automatic account linking. Tell the user that their
        // input credentials is wrong (so that they do through the password reset flow)
        toast.show('Invalid credentials. Please go through the password reset flow!')
      } else {
        // sign in successful. The session tokens are automatically handled by
        // the SDK.
        replace('/')
      }
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        toast.show(err.message)
      } else {
        toast.show('Oops! Something went wrong.')
      }
    }
  }

  return (
    <YStack flex={1} justifyContent='center' alignItems='center' space>
      <SignUpSignInComponent
        type='sign-in'
        handleOAuthWithPress={handleOAuthSignInWithPress}
        handleEmailWithPress={handleEmailSignInWithPress}
      />
    </YStack>
  )
}
