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

  const data = (await res.json()) as { status: string }
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

  const res = await callSignInUpAPI({
    provider: 'google',
    redirectUrl: '',
    code: user.serverAuthCode,
  })

  if (res.status !== 'OK') {
    throw new Error('Failed to sign in with Google')
  }
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

    const res = await callSignInUpAPI({
      provider,
      redirectUrl,
      code: params.queryParams.code,
      pkceCodeVerifier: authorizationUrlRes.pkceCodeVerifier,
    })

    if (res.status !== 'OK') {
      throw new Error('Failed to sign in with Discord')
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
  try {
    switch (provider) {
      case 'apple':
        await handleOAuthLoginWithApple()
        break
      case 'google':
        await handleOAuthLoginWithGoogle()
        break
      case 'discord':
        await handleOAuthLoginWithDiscord()
        break
      default:
        throw new Error(`Unsupported OAuth provider: ${provider}`)
    }
    // if we reach here means the sign-in was successful
    router.replace('/')
  } catch (error) {
    toast.show(error.message)
  }
}
