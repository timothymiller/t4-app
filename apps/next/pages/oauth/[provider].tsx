import { OAuthSignInScreen, OAuthSignInScreenProps } from 'app/features/oauth/screen'
import Head from 'next/head'

// Apple will POST form data to the redirect URI when scopes have been requested
// @link https://developer.apple.com/documentation/sign_in_with_apple/request_an_authorization_to_the_sign_in_with_apple_server
export { getServerSideProps } from 'app/features/oauth/screen'
export const runtime = 'experimental-edge'

export default function Page(props: OAuthSignInScreenProps) {
  return (
    <>
      <Head>
        <title>OAuth Sign In</title>
      </Head>
      <OAuthSignInScreen {...props} />
    </>
  )
}
