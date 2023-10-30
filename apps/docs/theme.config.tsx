import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'
import { useConfig } from 'nextra-theme-docs'
import Image from 'next/image'

const title = 'T4 App'

const config: DocsThemeConfig = {
  logo: (
    <>
      <Image src="/t4-logo.webp" width={42} height={42} alt={`${title} logo`} />
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
    key: 'become-a-sponsor',
    text: (
      <a href="https://github.com/sponsors/timothymiller" target="_blank">
        ✨ Access exclusive videos, tutorials, and apps. Become a sponsor →
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
  navbar: {
    extraContent: (
      <>
        <a
          style={{ padding: '0.5rem' }}
          target="_blank"
          href="https://twitter.com/ogtimothymiller"
          aria-label="Tim's twitter"
          rel="nofollow noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
          </svg>
        </a>
      </>
    ),
  },
}

export default config
