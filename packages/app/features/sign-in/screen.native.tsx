import { YStack, useToastController } from '@t4/ui'
import { SignUpSignInComponent } from 'app/features/sign-in/SignUpSignIn'
import { getApiUrl } from 'app/utils/trpc'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { useRouter } from 'solito/router'
import { emailPasswordSignIn } from 'supertokens-web-js/recipe/thirdpartyemailpassword'

export const SignInScreen = (): React.ReactNode => {
  const { replace } = useRouter()
  const toast = useToastController()

  const handleOAuthSignInWithPress = async (provider: 'google' | 'apple' | 'discord') => {
    if (provider === 'apple') {
      toast.show('Apple OAuth is not supported yet.')
      return
    }

    const redirectUrl = 't4://sign-in'

    try {
      // https://app.swaggerhub.com/apis/supertokens/FDI/1.18.0#/ThirdParty%20Recipe/authorisationUrl
      const authorizationUrlRes: {
        status: string
        urlWithQueryParams: string
        pkceCodeVerifier: string
      } = await fetch(
        `${getApiUrl()}/api/auth/authorisationurl?thirdPartyId=${provider}&redirectURIOnProviderDashboard=${redirectUrl}`
      ).then((res) => res.json())

      const result = await WebBrowser.openAuthSessionAsync(
        authorizationUrlRes.urlWithQueryParams,
        redirectUrl
      )

      if (result.type === 'success') {
        const params = Linking.parse(result.url)

        // https://app.swaggerhub.com/apis/supertokens/FDI/1.18.0#/ThirdParty%20Recipe/signInUp
        const response: {
          status: string
        } = await fetch(`${getApiUrl()}/api/auth/signinup`, {
          method: 'POST',
          body: JSON.stringify({
            thirdPartyId: provider,
            redirectURIInfo: {
              redirectURIOnProviderDashboard: redirectUrl,
              redirectURIQueryParams: {
                code: params.queryParams?.code,
              },
              pkceCodeVerifier: authorizationUrlRes.pkceCodeVerifier,
            },
          }),
        }).then((res) => res.json())

        if (response.status === 'OK') {
          replace('/')
        } else {
          toast.show('Oops! Something went wrong.')
        }
      }
    } catch (error) {
      toast.show(error.message)
    } finally {
      WebBrowser.maybeCompleteAuthSession()
    }
  }

  const handleEmailSignInWithPress = async (email: string, password: string) => {
    try {
      const response = await emailPasswordSignIn({
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
        for (const formField of response.formFields) {
          if (formField.id === 'email') {
            // Email validation failed (for example incorrect email syntax).
            toast.show(formField.error)
          }
        }
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
