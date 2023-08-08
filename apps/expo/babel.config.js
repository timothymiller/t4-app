module.exports = function (api) {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins: [
      require.resolve('expo-router/babel'),
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '../../.env',
          allowlist: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
          safe: false,
          allowUndefined: true
        }
      ],
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          root: ['../..'],
          alias: {
            // define aliases to shorten the import paths
            app: '../../packages/app',
            '@t4/api': '../../packages/api',
            '@t4/ui': '../../packages/ui'
          },
          extensions: ['.js', '.jsx', '.tsx', '.ios.js', '.android.js']
        }
      ],
      // if you want reanimated support
      // 'react-native-reanimated/plugin',
      ...(process.env.EAS_BUILD_PLATFORM === 'android'
        ? []
        : [
          [
            '@tamagui/babel-plugin',
            {
              components: ['@t4/ui', 'tamagui'],
              config: './tamagui.config.ts'
            }
          ]
        ]),
      [
        'transform-inline-environment-variables',
        {
          include: 'TAMAGUI_TARGET'
        }
      ],
      'jotai/babel/plugin-react-refresh'
    ]
  }
}
