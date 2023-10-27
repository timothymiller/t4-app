import { OAuthSignInScreen } from 'app/features/oauth/screen'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>OAuth Sign In</title>
      </Head>
      <OAuthSignInScreen />
    </>
  )
}
