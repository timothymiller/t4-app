const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx'
})

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  sw: "service-worker.js",
  cacheStartUrl: true,
  cacheOnFrontendNav: true,
  aggressiveFrontEndNavCaching: true,
  extendDefaultRuntimeCaching: true,
  workboxOptions: {
    runtimeCaching: [
    ],
  },
  swcMinify: true,
  reloadOnOnline: true
});

const boolVals = {
  true: true,
  false: false
}

const million = require('million/compiler')

const enableMillionJS =
  boolVals[process.env.ENABLE_MILLION_JS] ?? process.env.NODE_ENV === 'production'

const disableBrowserLogs =
  boolVals[process.env.DISABLE_BROWSER_LOGS] ?? process.env.NODE_ENV === 'production'

module.exports = function () {
  /** @type {import('next').NextConfig} */
  let config = {
    i18n: {
      locales: ['en-US'],
      defaultLocale: 'en-US'
    },
    compiler: {
      removeConsole: disableBrowserLogs
    },
  }

  const plugins = [
    withNextra,
    withPWA,
  ]

  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config)
    }
  }

  const millionConfig = {
    auto: true,
    mute: true
  }

  if (enableMillionJS) {
    return million.next(config, millionConfig);
  }

  return config

}
