import { ConfigContext, ExpoConfig } from '@expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID || '43272672-ff67-42e6-962b-730567148c3c',
    },
  },
  owner: process.env.EAS_OWNER || 'anku255',
  plugins: ['expo-router'],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  platforms: ['ios', 'android'],
  name: 'T4 App',
  slug: 't4-supertokens',
  updates: {
    url: 'https://u.expo.dev/43272672-ff67-42e6-962b-730567148c3c',
  },
  runtimeVersion: {
    policy: 'sdkVersion',
  },
})
