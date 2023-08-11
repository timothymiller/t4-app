import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'
import { useConfig } from 'nextra-theme-docs'
import Image from 'next/image'

const title = 'T4 App'

const config: DocsThemeConfig = {
  logo: (
    <>
      <Image src="/t4-logo.png" width={42} height={42} alt={`${title} logo`} />
      <span style={{ paddingLeft: 8 }}>{title} Docs</span>
    </>
  ),
  project: {
    link: 'https://github.com/timothymiller/t4-app',
  },
  chat: {
    link: 'https://discord.gg/wj2GV7AvQd',
  },
  docsRepositoryBase: 'https://github.com/timothymiller/t4-app/blob/main/apps/docs',
  footer: {
    text: '©️ Copyright 2023 - T4 App Agency, LLC',
  },
  primaryHue: 295,
  banner: {
    key: 'book-a-call',
    text: (
      <a
        href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1A5PlGGerAUohHYZ2a6knxIcdoHh17FckhySU-w0V-eweV7ZFR7DK03o3sxnWfwoEr0_mNR80J"
        target="_blank"
      >
        👨‍💼💼 Hire us for your next project. Book a call →
      </a>
    ),
  },
  sidebar: {
    autoCollapse: false,
    defaultMenuCollapseLevel: 100,
  },
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: `%s – ${title}`,
      }
    }
    return {
      titleTemplate: title + ' Docs',
    }
  },
  head: () => {
    const { asPath } = useRouter()
    const { frontMatter } = useConfig()
    const url = 'https://t4stack.com' + asPath
    return (
      <>
        <meta property="og:url" content={url} />
        <meta property="og:title" content={frontMatter.title || title} />
        <meta
          property="og:description"
          content={
            frontMatter.description || 'Type-Safe, Full-Stack Starter Kit for React Native + Web.'
          }
        />
        <link rel="icon" href="/favicon.ico" />
      </>
    )
  },
}

export default config
