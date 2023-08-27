import 'raf/polyfill'
import '@tamagui/core/reset.css'
import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/700.css'

import { Provider } from 'app/provider'
import { trpc } from 'app/utils/trpc/index.web'
import Head from 'next/head'
import type { SolitoAppProps } from 'solito'
import type { Session } from '@supabase/supabase-js'

if (process.env.NODE_ENV === 'production') {
  require('../public/tamagui.css')
}

function T4App({ Component, pageProps }: SolitoAppProps<{ initialSession: Session | null }>) {
  return (
    <>
      <Head>
        <title>T4 App</title>
        <meta
          name="description"
          content="Type-Safe, Full-Stack Starter Kit for React Native + Web."
        />
        <link rel="icon" href="/favicon.ico" />
        {/* TODO: Add additional PWA resources */}
      </Head>

      <Provider initialSession={pageProps.initialSession}>
        <Component {...pageProps} />
      </Provider>
    </>
  )
}

export default trpc.withTRPC(T4App)
