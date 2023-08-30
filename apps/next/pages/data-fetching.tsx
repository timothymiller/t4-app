import { DataFetchingScreen } from 'app/features/data-fetching/screen'
import type { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import jwt from '@tsndr/cloudflare-worker-jwt'
import { secureCookieOptions } from 'app/provider/auth/index.web'

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
  props: {
    data: string
  }
}

interface Redirect {
  redirect: {
    destination: string
    permanent: boolean
  }
}

export const redirectToSignIn = {
  redirect: {
    destination: '/sign-in',
    permanent: false,
  },
}

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext
): Promise<Props | Redirect> => {
  const supabase = createPagesServerClient(ctx, {
    cookieOptions: secureCookieOptions,
  })
  const session = await supabase.auth.getSession()
  const token = session.data.session?.access_token
  if (token === undefined) {
    return redirectToSignIn
  }

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
      return redirectToSignIn
    }
  }

  // Can use session info safely now
  const userId = session.data.session?.user.id
  if (userId === undefined) {
    return redirectToSignIn
  }

  return {
    props: {
      data: userId,
    },
  }
}
