import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'
import { useConfig } from 'nextra-theme-docs'

const title = 'T4 App'

const config: DocsThemeConfig = {
  logo: <span>📚 {title} Docs</span>,
  project: {
    link: 'https://github.com/timothymiller/t4-app',
  },
  chat: {
    link: 'https://discord.gg/wj2GV7AvQd',
  },
  docsRepositoryBase: 'https://github.com/timothymiller/t4-app/apps/docs',
  footer: {
    text: '©️ Copyright 2023 Timothy Miller',
  },
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: `%s – ${title}`,
      }
    }
    return {
      titleTemplate: title,
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
      </>
    )
  },
}

export default config
