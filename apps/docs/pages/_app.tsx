import type { AppProps } from 'next/app'
import Head from 'next/head'

const description = 'Type-Safe, Full-Stack Starter Kit for React Native + Web.'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>T4 App Docs</title>
        <meta name="description" content={description} />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="mask-icon" href="/pwa/icons/mask-icon.svg" color="#FFFFFF" />
        <meta name="theme-color" content="#5E35B1" />
        <link rel="apple-touch-icon" href="/pwa/icons/touch-icon-iphone.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/pwa/icons/touch-icon-ipad.png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/pwa/icons/touch-icon-iphone-retina.png"
        />
        <link rel="apple-touch-icon" sizes="167x167" href="/pwa/icons/touch-icon-ipad-retina.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://t4stack.com" />
        <meta name="twitter:title" content="T4 App Docs" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="/pwa/icons/twitter.png" />
        <meta name="twitter:creator" content="@ogtimothymiller" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="T4 App Docs" />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content="T4 App Docs" />
        <meta property="og:url" content="https://t4stack.com" />
        <meta property="og:image" content="/pwa/icons/og.png" />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_2048.png"
          sizes="2048x2732"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1668.png"
          sizes="1668x2224"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1536.png"
          sizes="1536x2048"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1125.png"
          sizes="1125x2436"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1242.png"
          sizes="1242x2208"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_750.png"
          sizes="750x1334"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_640.png"
          sizes="640x1136"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
