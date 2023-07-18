import { CustomToast, TamaguiProvider, TamaguiProviderProps, ToastProvider } from '@t4/ui'
import { useColorScheme } from 'react-native'
import { Metrics, SafeAreaProvider } from 'react-native-safe-area-context'
import { ToastViewport } from './toast/ToastViewport'
import config from '../tamagui.config'
import { TRPCProvider } from './trpc'

export const initialWindowMetrics: Metrics | null = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
}

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  const scheme = useColorScheme()

  return (
    <TamaguiProvider
      config={config}
      disableInjectCSS
      defaultTheme={scheme === 'dark' ? 'dark' : 'light'}
      {...rest}
    >
      <SafeAreaProvider>
        <ToastProvider swipeDirection="horizontal" duration={6000} native={['mobile']}>
          <TRPCProvider>{children}</TRPCProvider>
          <CustomToast />
          <ToastViewport />
        </ToastProvider>
      </SafeAreaProvider>
    </TamaguiProvider>
  )
}
