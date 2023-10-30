import {
  type Metrics,
  SafeAreaProvider as SafeAreaProviderOg,
} from 'react-native-safe-area-context'

export const initialWindowMetrics: Metrics | null = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
}

export const SafeAreaProvider = ({ children }: { children: React.ReactNode }): React.ReactNode => {
  return <SafeAreaProviderOg initialMetrics={initialWindowMetrics}>{children}</SafeAreaProviderOg>
}
