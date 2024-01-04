const { withTamagui } = require('@tamagui/next-plugin')
const { join } = require('path')
const million = require('million/compiler')
const pattycake = require('pattycake')
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  sw: 'service-worker.js',
  swcMinify: true,
})

const boolVals = {
  true: true,
  false: false,
}

const disableExtraction =
  boolVals[process.env.DISABLE_EXTRACTION] ?? process.env.NODE_ENV === 'development'

const disableBrowserLogs =
  boolVals[process.env.DISABLE_BROWSER_LOGS] ?? process.env.NODE_ENV === 'production'

const enableMillionJS =
  boolVals[process.env.ENABLE_MILLION_JS] ?? process.env.NODE_ENV === 'production'

// Temporarily disabled, produces chatty logs
const enablePattyCake = false
// boolVals[process.env.ENABLE_PATTY_CAKE] ?? process.env.NODE_ENV === 'production'

// Enabling causes FOUC on page refreshes
const optimizeCss = false

const plugins = [
  withPWA,
  withTamagui({
    appDir: true,
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
    },
  }),
]

// If using nextjs edge runtime and need cloudflare bindings:
// if (process.env.NODE_ENV === 'development') {
// 	// we import the utility from the next-dev submodule
// 	const { setupDevBindings } = require('@cloudflare/next-on-pages/next-dev');

// 	// we call the utility with the bindings we want to have access to
// 	setupDevBindings({
// 		kvNamespaces: ['MY_KV_1', 'MY_KV_2'],
// 		r2Buckets: ['MY_R2'],
// 		durableObjects: {
// 			MY_DO: {
// 				scriptName: 'do-worker',
// 				className: 'DurableObjectClass',
// 			},
// 		},
// 		// ...
// 	});
// }

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
      ignoreBuildErrors: true,
    },
    modularizeImports: {
      '@tamagui/lucide-icons': {
        transform: '@tamagui/lucide-icons/dist/esm/icons/{{kebabCase member}}',
        skipDefaultConversion: true,
      },
    },
    transpilePackages: [
      'solito',
      'react-native-web',
      'expo-linking',
      'expo-constants',
      'expo-modules-core',
      'react-native-safe-area-context',
      'react-native-reanimated',
      'react-native-gesture-handler',
    ],
    experimental: {
      optimizeCss,
      webpackBuildWorker: true,
      forceSwcTransforms: true,
      scrollRestoration: true,
      swcPlugins: [
        [
          'next-superjson-plugin',
          {
            excluded: [],
          },
        ],
      ],
    },
    compiler: {
      removeConsole: disableBrowserLogs,
    },
  }

  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config),
    }
  }

  const millionConfig = {
    auto: true,
    mute: true,
  }

  if (enableMillionJS) {
    config = million.next(config, millionConfig)
  }

  if (enablePattyCake) {
    config = pattycake.next(config)
  }

  return config
}
