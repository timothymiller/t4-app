import { SSRScreen } from 'app/features/ssr/screen'
import type { GetServerSidePropsContext } from 'next/types'
import Head from 'next/head'
import { AuthorizedProps } from 'utils/types/AuthorizedProps'
import { redirectToSignIn } from 'utils/redirects'
import { getSession, verifyToken } from 'utils/auth'

export default function Page() {
  return (
    <>
      <Head>
        <title>Server Side Rendering</title>
      </Head>
      <SSRScreen />
    </>
  )
}

export interface SSRProps {
  data: string
}

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<AuthorizedProps<SSRProps>> => {
  const session = await getSession(ctx)
  const token = session?.access_token

  if (token === undefined) {
    // No token found
    return redirectToSignIn
  }

  const authorized = await verifyToken(token)
  if (authorized === false) {
    // JWT is invalid
    return redirectToSignIn
  }

  // Can use session info safely now
  // Perform data fetching here

  return {
    props: {
      data: '',
      initialSession: session,
    },
  }
}

export const runtime = 'edge'
