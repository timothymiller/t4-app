import { CustomToast, ToastProvider } from '@t4/ui'
import { Session } from 'app/utils/auth'
import { LuciaAuthProvider as AuthProvider } from './auth'
import { SafeAreaProvider } from './safe-area'
import { SolitoImageProvider } from './solito-image'
import { TamaguiProvider } from './tamagui'
import { TamaguiThemeProvider } from './theme'
import { ToastViewport } from './toast-viewport'
import { TRPCProvider } from './trpc'

import { initializeLegendState } from 'app/provider/state'

export function Provider({
  children,
  initialSession,
}: {
  children: React.ReactNode
  initialSession: Session | null
}) {
  initializeLegendState()

  return (
    <TamaguiThemeProvider>
      <SafeAreaProvider>
        <SolitoImageProvider>
          <ToastProvider swipeDirection='horizontal' duration={6000} native={['mobile']}>
            <TRPCProvider>
              <AuthProvider initialSession={initialSession}>
                <TamaguiProvider>
                  {children}
                  <CustomToast />
                  <ToastViewport />
                </TamaguiProvider>
              </AuthProvider>
            </TRPCProvider>
          </ToastProvider>
        </SolitoImageProvider>
      </SafeAreaProvider>
    </TamaguiThemeProvider>
  )
}
