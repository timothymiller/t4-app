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

const title = 'T4 App'
const description = 'Type-Safe, Full-Stack Starter Kit for React Native + Web.'
const url = 'https://t4stack.com'

function T4App({ Component, pageProps }: SolitoAppProps<{ initialSession: Session | null }>) {
  return (
    <>
      <Metadata />
      <Provider initialSession={pageProps.initialSession}>
        <Component {...pageProps} />
      </Provider>
    </>
  )
}

export default trpc.withTRPC(T4App)

const Metadata = () => (
  <Head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    {/* Metadata */}
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" href="/favicon.ico" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="mask-icon" href="/icons/mask-icon.svg" color="#FFFFFF" />
    <meta name="theme-color" content="#ffffff" />
    {/* Social Media Cards  */}
    <link rel="manifest" href="/manifest.json" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:url" content={url} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content="/icons/twitter.png" />
    <meta name="twitter:creator" content="@DavidWShadow" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:site_name" content={title} />
    <meta property="og:url" content={url} />
    <meta property="og:image" content="/icons/og.png" />
    {/* PWA App Icons for iOS */}
    <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
    <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
    <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" />
    {/* PWA Splash Screens for iOS */}
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
      href="/splash_screens/iPhone_14_Pro_Max_landscape.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
      href="/splash_screens/iPhone_14_Pro_landscape.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
      href="/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
      href="/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
      href="/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
      href="/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
      href="/splash_screens/iPhone_11__iPhone_XR_landscape.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
      href="/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
      href="/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
      href="/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
      href="/splash_screens/12.9__iPad_Pro_landscape.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
      href="/splash_screens/11__iPad_Pro__10.5__iPad_Pro_landscape.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
      href="/splash_screens/10.9__iPad_Air_landscape.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
      href="/splash_screens/10.5__iPad_Air_landscape.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
      href="/splash_screens/10.2__iPad_landscape.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
      href="/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
      href="/splash_screens/8.3__iPad_Mini_landscape.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      href="/splash_screens/iPhone_14_Pro_Max_portrait.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      href="/splash_screens/iPhone_14_Pro_portrait.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      href="/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      href="/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      href="/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      href="/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      href="/splash_screens/iPhone_11__iPhone_XR_portrait.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      href="/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      href="/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      href="/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      href="/splash_screens/12.9__iPad_Pro_portrait.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      href="/splash_screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      href="/splash_screens/10.9__iPad_Air_portrait.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      href="/splash_screens/10.5__iPad_Air_portrait.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      href="/splash_screens/10.2__iPad_portrait.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      href="/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png"
    />
    <link
      rel="apple-touch-startup-image"
      media="screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      href="/splash_screens/8.3__iPad_Mini_portrait.png"
    />
  </Head>
)
