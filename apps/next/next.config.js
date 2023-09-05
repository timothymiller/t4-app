const { withTamagui } = require('@tamagui/next-plugin')
const { join } = require('path')
const million = require('million/compiler')
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

const disableExtraction =
  boolVals[process.env.DISABLE_EXTRACTION] ?? process.env.NODE_ENV === 'development'

const disableBrowserLogs =
  boolVals[process.env.DISABLE_BROWSER_LOGS] ?? process.env.NODE_ENV === 'production'

const enableMillionJS =
  boolVals[process.env.ENABLE_MILLION_JS] ?? process.env.NODE_ENV === 'production'

// Enabling causes FOUC on page refreshes
const optimizeCss = false // boolVals[process.env.OPTIMIZE_CSS] ?? process.env.NODE_ENV === 'production'

const plugins = [
  withPWA,
  withTamagui({
    config: './tamagui.config.ts',
    components: ['tamagui', '@t4/ui'],
    importsWhitelist: ['constants.js', 'colors.js'],
    outputCSS: process.env.NODE_ENV === 'production' ? './public/tamagui.css' : null,
    logTimings: true,
    disableExtraction,
    useReactNativeWebLite: true,
    shouldExtract: (path) => {
      if (path.includes(join('packages', 'app'))) {
        return true
      }
    }
  })
]

module.exports = function () {
  /** @type {import('next').NextConfig} */
  let config = {
    // Uncomment if you want to use Cloudflare's Paid Image Resizing w/ Next/Image
    // images: {
    //   loader: 'custom',
    //   loaderFile: './cfImageLoader.js',
    // },
    // Using Solito image loader without Cloudflare's Paid Image Resizing
    images: {},
    typescript: {
      ignoreBuildErrors: true
    },
    modularizeImports: {
      '@tamagui/lucide-icons': {
        transform: '@tamagui/lucide-icons/dist/esm/icons/{{kebabCase member}}',
        skipDefaultConversion: true
      }
    },
    transpilePackages: [
      'solito',
      'expo-linking',
      'expo-constants',
      'expo-modules-core',
      'react-native-safe-area-context',
      'react-native-reanimated',
      'react-native-gesture-handler'
    ],
    experimental: {
      /*
       A few notes before enabling app directory:

       - App dir is not yet stable - Usage of this for production apps is discouraged.
       - Tamagui doesn't support usage in React Server Components yet (usage with 'use client' is supported).
       - Solito doesn't support app dir at the moment - You'll have to remove Solito.
       - The `/app` in this starter has the same routes as the `/pages` directory. You should probably remove `/pages` after enabling this.
      */
      appDir: false,
      optimizeCss,
      forceSwcTransforms: true,
      scrollRestoration: true,
      legacyBrowsers: false
    },
    compiler: {
      removeConsole: disableBrowserLogs
    },
  }

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
  return config;
}
