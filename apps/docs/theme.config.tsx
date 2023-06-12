import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'
import { useConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>📚 T4 App Docs</span>,
  project: {
    link: 'https://github.com/timothymiller/t4-app',
  },
  chat: {
    link: 'https://discord.gg/U7AsdbSS',
  },
  docsRepositoryBase: 'https://github.com/timothymiller/t4-app',
  footer: {
    text: '©️ Copyright 2023 Timothy Miller',
  },
  head: () => {
    const { asPath } = useRouter()
    const { frontMatter } = useConfig()
    const url = 'https://t4stack.com' + asPath
    return (
      <>
        <meta property="og:url" content={url} />
        <meta property="og:title" content={frontMatter.title || 'T4 App'} />
        <meta
          property="og:description"
          content={
            frontMatter.description || 'Type-Safe, Full-Stack Starter Kit for React Native + Web.'
          }
        />
      </>
    )
  },
}

export default config
