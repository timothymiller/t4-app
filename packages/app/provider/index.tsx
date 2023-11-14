import { CustomToast, ToastProvider } from '@t4/ui'
import { AuthProvider } from './auth'
import { SafeAreaProvider } from './safe-area'
import { SolitoImageProvider } from './solito-image'
import { TamaguiProvider } from './tamagui'
import { TamaguiThemeProvider } from './theme'
import { ToastViewport } from './toast-viewport'
import { TRPCProvider } from './trpc'

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
            <ToastProvider swipeDirection='horizontal' duration={6000} native={['mobile']}>
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
