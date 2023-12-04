import { useToastController } from '@t4/ui/src'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { OAuthProvider } from './type'
import { getApiUrl } from 'app/utils/trpc'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { useRouter } from 'solito/router'

export const callSignInUpAPI = async ({
  provider,
  redirectUrl,
  code,
  pkceCodeVerifier,
}: {
  provider: OAuthProvider
  redirectUrl: string
  code: string
  pkceCodeVerifier?: string
}) => {
  // https://app.swaggerhub.com/apis/supertokens/FDI/1.18.0#/ThirdParty%20Recipe/signInUp
  const res = await fetch(`${getApiUrl()}/api/auth/signinup`, {
    method: 'POST',
    body: JSON.stringify({
      thirdPartyId: provider,
      redirectURIInfo: {
        redirectURIOnProviderDashboard: redirectUrl,
        redirectURIQueryParams: { code },
        ...(pkceCodeVerifier && { pkceCodeVerifier }),
      },
    }),
  })

  if (res.status !== 200) {
    const errorMessage = await res.text()
    throw new Error(`Failed to sign in with ${provider}: ${errorMessage}`)
  }

  const data = (await res.json()) as { status: string; createdNewRecipeUser: boolean; user: any }
  return data
}

export const handleOAuthLoginWithApple = async () => {
  throw new Error('Apple OAuth is not supported yet.')
}

export const handleOAuthLoginWithGoogle = async () => {
  if (
    !process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
    !process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
  ) {
    throw new Error(
      'Missing Google OAuth client ID! Please read the instructions in the README.md file '
    )
  }

  GoogleSignin.configure({
    webClientId: `${process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID}`,
    iosClientId: `${process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID}`,
    offlineAccess: true,
  })

  const user = await GoogleSignin.signIn({})

  if (!user.serverAuthCode) {
    throw new Error('Failed to get serverAuthCode in OAuth response')
  }

  return { redirectUrl: '', code: user.serverAuthCode }
}

export const handleOAuthLoginWithDiscord = async () => {
  const redirectUrl = Linking.createURL('/sign-in')
  const provider = 'discord'
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

    if (result.type !== 'success') {
      throw new Error('Failed to get the authorizationUrl from the server')
    }

    const params = Linking.parse(result.url)

    if (!params.queryParams?.code || typeof params.queryParams.code !== 'string') {
      throw new Error("Couldn't find code in the OAuth response")
    }

    return {
      redirectUrl: redirectUrl,
      code: params.queryParams.code,
      pkceCodeVerifier: authorizationUrlRes.pkceCodeVerifier,
    }
  } finally {
    WebBrowser.maybeCompleteAuthSession()
  }
}

export const handleOAuthSignInWithPress = async ({
  provider,
  toast,
  router,
}: {
  provider: OAuthProvider
  toast: ReturnType<typeof useToastController>
  router: ReturnType<typeof useRouter>
}) => {
  let response: {
    redirectUrl: string
    code: string
    pkceCodeVerifier?: string
  }
  try {
    switch (provider) {
      case 'apple':
        response = await handleOAuthLoginWithApple()
        break
      case 'google':
        response = await handleOAuthLoginWithGoogle()
        break
      case 'discord':
        response = await handleOAuthLoginWithDiscord()
        break
      default:
        throw new Error(`Unsupported OAuth provider: ${provider}`)
    }

    const res = await callSignInUpAPI({
      provider,
      redirectUrl: response.redirectUrl,
      code: response.code,
      pkceCodeVerifier: response.pkceCodeVerifier,
    })

    if (res.status === 'OK') {
      if (res.createdNewRecipeUser && res.user.loginMethods.length === 1) {
        // sign up successful
      } else {
        // sign in successful
      }
      router.replace('/')
    } else if (res.status === 'SIGN_IN_UP_NOT_ALLOWED') {
      // this can happen due to automatic account linking. Please see - supertokens account linking docs
      toast.show('Sign in unsuccessful. Please contact support.')
    } else {
      // SuperTokens requires that the third party provider
      // gives an email for the user. If that's not the case, sign up / in
      // will fail.

      // As a hack to solve this, you can override the backend functions to create a fake email for the user.

      toast.show('No email provided by social login. Please use another form of login')
      router.replace('/sign-in')
    }
  } catch (error) {
    toast.show(error.message)
  }
}
