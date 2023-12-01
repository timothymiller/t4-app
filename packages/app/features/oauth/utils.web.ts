import { useToastController } from '@t4/ui'
import { getAuthorisationURLWithQueryParamsAndSetState } from 'supertokens-web-js/recipe/thirdpartyemailpassword'
import { OAuthProvider } from './type'

export const handleOAuthSignInWithPress = async ({
  provider,
  toast,
}: { provider: OAuthProvider; toast: ReturnType<typeof useToastController> }) => {
  try {
    const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
      thirdPartyId: provider,
      frontendRedirectURI: `${process.env.NEXT_PUBLIC_APP_URL}/oauth/${provider}`,
      ...(provider === 'apple' && {
        redirectURIOnProviderDashboard: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/callback/apple`,
      }),
    })

    window.location.assign(authUrl)
  } catch (err) {
    if (err.isSuperTokensGeneralError === true) {
      toast.show(err.message)
    } else {
      toast.show('Oops! Something went wrong.')
    }
  }
}
