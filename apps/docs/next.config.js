const million = require('million/compiler')

const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx'
})

const boolVals = {
  true: true,
  false: false
}

const enableMillionJS =
  boolVals[process.env.ENABLE_MILLION_JS] ?? process.env.NODE_ENV === 'production'

const disableBrowserLogs =
  boolVals[process.env.DISABLE_BROWSER_LOGS] ?? process.env.NODE_ENV === 'production'

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

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
  withPWA,
  withNextra,
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

module.exports = function () {
  /** @type {import('next').NextConfig} */
  if (enableMillionJS) {
    return million.next(config, millionConfig);
  }
  
  module.exports = config
  
}
