import { Paragraph, useToastController } from '@t4/ui'
import { useEffect } from 'react'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'
import { thirdPartySignInAndUp } from 'supertokens-web-js/recipe/thirdpartyemailpassword'

const { useParam } = createParam<{ provider: string; redirectTo: string }>()

export const OAuthSignInScreen = (): React.ReactNode => {
  const toast = useToastController()
  const router = useRouter()
  const [provider] = useParam('provider')
  const [redirectTo] = useParam('redirectTo')

  async function handleOAuthCallback() {
    try {
      const response = await thirdPartySignInAndUp()

      if (response.status === 'OK') {
        if (response.createdNewRecipeUser && response.user.loginMethods.length === 1) {
          // sign up successful
        } else {
          // sign in successful
        }
        router.replace(redirectTo ?? '/')
      } else if (response.status === 'SIGN_IN_UP_NOT_ALLOWED') {
        // this can happen due to automatic account linking. Please see - supertokens account linking docs
        toast.show('Sign in unsuccessful.Please contact support.')
      } else {
        // SuperTokens requires that the third party provider
        // gives an email for the user. If that's not the case, sign up / in
        // will fail.

        // As a hack to solve this, you can override the backend functions to create a fake email for the user.

        toast.show('No email provided by social login. Please use another form of login')
        router.replace('/sign-in')
      }
    } catch (err: any) {
      if (err.isSuperTokensGeneralError === true) {
        toast.show(err.message)
      } else {
        toast.show('Oops! Something went wrong.')
      }
      router.replace('/sign-in')
    }
  }

  useEffect(() => {
    if (!provider) return
    handleOAuthCallback()
  }, [provider])

  return <Paragraph p='$2'>Redirecting...</Paragraph>
}
