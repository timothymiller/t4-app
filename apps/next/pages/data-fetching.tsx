import { DataFetchingScreen } from 'app/features/data-fetching/screen'
import type { GetServerSidePropsContext } from 'next/types'
import Head from 'next/head'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import jwt from '@tsndr/cloudflare-worker-jwt'
import { secureCookieOptions } from 'app/utils/supabase/libs/cookies'
import { AuthorizedProps } from 'utils/types/AuthorizedProps'
import { redirectToSignIn } from 'utils/redirects'
import { getSession } from 'utils/auth'

export default function Page() {
  return (
    <>
      <Head>
        <title>Data Fetching</title>
      </Head>
      <DataFetchingScreen />
    </>
  )
}

interface Props {
  data: string
}

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<AuthorizedProps<Props>> => {
  const session = await getSession(ctx)
  const token = session?.access_token

  if (token === undefined) {
    // No token found
    return redirectToSignIn
  }

  // const supabase = createPagesServerClient(ctx, {
  //   cookieOptions: secureCookieOptions,
  // })
  // const supabaseResponse = await supabase.auth.getSession()
  // const session = supabaseResponse?.data.session
  // const token = session?.access_token
  // if (token === undefined) {
  //   // No token found
  //   return redirectToSignIn
  // }

  // Verify JWT
  let authorized = false
  try {
    authorized = await jwt.verify(token, process.env.JWT_VERIFICATION_KEY as string, {
      algorithm: 'HS256',
    })
  } catch (e) {
    console.error(e)
  } finally {
    if (authorized === false) {
      console.log('JWT not authorized')
      return redirectToSignIn
    }
  }

  // Can use session info safely now
  const userId = session?.user.id
  if (userId === undefined) {
    console.log('No user id found')
    return redirectToSignIn
  }

  return {
    props: {
      data: userId,
      initialSession: session,
    },
  }
}
