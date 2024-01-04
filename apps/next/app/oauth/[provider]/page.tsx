import { OAuthSignInScreen, OAuthSignInScreenProps } from 'app/features/oauth/screen'
import { Metadata } from 'next'
import { headers } from 'next/headers'

export const metadata: Metadata = {
  title: 'OAuth Sign In',
}
export const runtime = 'edge'

// Apple will POST form data to the redirect URI when scopes have been requested
// @link https://developer.apple.com/documentation/sign_in_with_apple/request_an_authorization_to_the_sign_in_with_apple_server
function getServerSideProps(): OAuthSignInScreenProps {
  // Fetch data from external API
  let appleUser = null
  try {
    const userJSON = headers().get('x-apple-user') as string | undefined
    if (typeof userJSON === 'string') {
      appleUser = JSON.parse(userJSON)
    }
  } catch (e: unknown) {
    console.error(e)
  }
  return { appleUser }
}

export default async function Page() {
  return <OAuthSignInScreen {...getServerSideProps()} />
}
