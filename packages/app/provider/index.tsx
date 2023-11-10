import { CustomToast, ToastProvider } from '@t4/ui'
import { ToastViewport } from './toast-viewport'
import { TRPCProvider } from './trpc'
import { SafeAreaProvider } from './safe-area'
import { TamaguiThemeProvider } from './theme'
import { TamaguiProvider } from './tamagui'
import { SolitoImageProvider } from './solito-image'
import { AuthProvider } from './auth'

export function Provider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TamaguiThemeProvider>
      <TamaguiProvider>
        <SafeAreaProvider>
          <SolitoImageProvider>
            <ToastProvider swipeDirection="horizontal" duration={6000} native={['mobile']}>
              <AuthProvider>
                <TRPCProvider>{children}</TRPCProvider>
                <CustomToast />
                <ToastViewport />
              </AuthProvider>
            </ToastProvider>
          </SolitoImageProvider>
        </SafeAreaProvider>
      </TamaguiProvider>
    </TamaguiThemeProvider>
  )
}
