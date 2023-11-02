import { ConfigContext, ExpoConfig } from '@expo/config'
import env from "./env.js"

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  extra: {
    eas: {
      projectId: env.EAS_PROJECT_ID,
    },
  },
  owner: env.EAS_OWNER,
  plugins: ['expo-router'],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  platforms: ['ios', 'android'],
  name: 'T4 App',
  slug: env.EAS_SLUG,
  updates: {
    url: 'https://u.expo.dev/' + env.EAS_PROJECT_ID,
  },
  runtimeVersion: {
    policy: 'sdkVersion',
  },
})
