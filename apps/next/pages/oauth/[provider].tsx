import { OAuthSignInScreen, OAuthSignInScreenProps } from 'app/features/oauth/screen'
import Head from 'next/head'

// Apple will POST form data to the redirect URI when scopes have been requested
// @link https://developer.apple.com/documentation/sign_in_with_apple/request_an_authorization_to_the_sign_in_with_apple_server
// However, it does deploy to cloudflare due to issues with the SSR function for the react screen
// We are looking into alternatives (possibly using nextjs api routes) to handle Apple's form post
// export { getServerSideProps } from 'app/features/oauth/screen'
// export const runtime = 'experimental-edge'

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
