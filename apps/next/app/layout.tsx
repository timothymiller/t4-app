if (typeof requestAnimationFrame === 'undefined') {
  if (typeof setImmediate !== 'undefined') {
    globalThis.requestAnimationFrame = setImmediate
  } else {
    globalThis.requestAnimationFrame = (callback) => {
      const now = Date.now()
      callback(now)
      return now
    }
  }
}
import '@tamagui/core/reset.css'
import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/700.css'

import { Provider } from 'app/provider'
import { StylesProvider } from './styles-provider'
import { Metadata, Viewport } from 'next'

if (process.env.NODE_ENV === 'production') {
  require('../public/tamagui.css')
}

const appUrl = `${process.env.NEXT_PUBLIC_APP_URL}`
const title = `${process.env.NEXT_PUBLIC_METADATA_NAME}`
const description = `${process.env.NEXT_PUBLIC_METADATA_DESCRIPTION}`

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFFFF',
  // minimumScale: 1,
  // maximumScale: 1,
  // userScalable: false,
}

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title,
  description,
  openGraph: {
    type: 'website',
    url: appUrl,
    title,
    description,
    images: [
      {
        url: `${appUrl}/pwa/icons/apple-touch-icon.png`,
        width: 180,
        height: 180,
        alt: title,
      },
    ],
  },
  appleWebApp: {
    title,
    statusBarStyle: 'black-translucent',
  },
  icons: [
    /* Favicons */
    {
      url: '/pwa/icons/favicon.ico',
      rel: 'icon',
    },
    {
      url: '/pwa/icons/favicon.ico',
      rel: 'shortcut icon',
    },
    /* PWA App Icons for iOS */
    {
      url: '/pwa/icons/touch-icon-iphone.png',
      rel: 'apple-touch-icon',
    },
    {
      url: '/pwa/icons/touch-icon-ipad.png',
      sizes: '152x152',
      rel: 'apple-touch-icon',
    },
    {
      url: '/pwa/icons/touch-icon-iphone-retina.png',
      sizes: '180x180',
      rel: 'apple-touch-icon',
    },
    {
      url: '/pwa/icons/touch-icon-ipad-retina.png',
      sizes: '167x167',
      rel: 'apple-touch-icon',
    },
    /* PWA Splash Screens for iOS */
    {
      url: '/pwa/splash-screens/iPhone_14_Pro_Max_landscape.png',
      media:
        'screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/iPhone_14_Pro_landscape.png',
      media:
        'screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png',
      media:
        'screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png',
      media:
        'screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png',
      media:
        'screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png',
      media:
        'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/iPhone_11__iPhone_XR_landscape.png',
      media:
        'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png',
      media:
        'screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png',
      media:
        'screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png',
      media:
        'screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/12.9__iPad_Pro_landscape.png',
      media:
        'screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/11__iPad_Pro__10.5__iPad_Pro_landscape.png',
      media:
        'screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/10.9__iPad_Air_landscape.png',
      media:
        'screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/10.5__iPad_Air_landscape.png',
      media:
        'screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/10.2__iPad_landscape.png',
      media:
        'screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png',
      media:
        'screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/8.3__iPad_Mini_landscape.png',
      media:
        'screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/iPhone_14_Pro_Max_portrait.png',
      media:
        'screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/iPhone_14_Pro_portrait.png',
      media:
        'screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png',
      media:
        'screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png',
      media:
        'screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png',
      media:
        'screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png',
      media:
        'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/iPhone_11__iPhone_XR_portrait.png',
      media:
        'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png',
      media:
        'screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png',
      media:
        'screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png',
      media:
        'screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/12.9__iPad_Pro_portrait.png',
      media:
        'screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png',
      media:
        'screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/10.9__iPad_Air_portrait.png',
      media:
        'screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/10.5__iPad_Air_portrait.png',
      media:
        'screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/10.2__iPad_portrait.png',
      media:
        'screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png',
      media:
        'screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      rel: 'apple-touch-startup-image',
    },
    {
      url: '/pwa/splash-screens/8.3__iPad_Mini_portrait.png',
      media:
        'screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      rel: 'apple-touch-startup-image',
    },
  ],
}

const T4App = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='en'>
      <body>
        <script
          key='tamagui-animations-mount'
          dangerouslySetInnerHTML={{
            // avoid flash of animated things on enter
            __html: `document.documentElement.classList.add('t_unmounted')`,
          }}
        />
        <StylesProvider>
          <Provider initialSession={null}>{children}</Provider>
        </StylesProvider>
      </body>
    </html>
  )
}

export default T4App
