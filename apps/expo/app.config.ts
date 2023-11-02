import { ConfigContext, ExpoConfig } from '@expo/config'
import env from './env.js'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  extra: {
    eas: {
      projectId: env.EAS_PROJECT_ID || '85fc6ccd-0ce1-4e4d-804c-b15df989f97e',
    },
  },
  owner: env.EAS_OWNER || 'timothymiller',
  plugins: ['expo-router'],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  platforms: ['ios', 'android'],
  name: 'T4 App',
  slug: 't4-demo',
  updates: {
    url: 'https://u.expo.dev/' + (env.EAS_PROJECT_ID || '85fc6ccd-0ce1-4e4d-804c-b15df989f97e'),
  },
  runtimeVersion: {
    policy: 'sdkVersion',
  },
})
