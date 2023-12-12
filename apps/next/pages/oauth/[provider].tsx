import { OAuthSignInScreen, OAuthSignInScreenProps } from 'app/features/oauth/screen'
import Head from 'next/head'

export { getServerSideProps } from 'app/features/oauth/screen'

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
