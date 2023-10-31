import { CustomToast, ToastProvider } from '@t4/ui'
import { ToastViewport } from './toast-viewport'
import { TRPCProvider } from './trpc'
import { SafeAreaProvider } from './safe-area'
import { TamaguiThemeProvider } from './theme'
import { TamaguiProvider } from './tamagui'
import { SolitoImageProvider } from './solito-image'
import { Session } from 'app/utils/auth'
import { LuciaAuthProvider as AuthProvider } from './auth'

export function Provider({
  children,
  initialSession,
}: {
  children: React.ReactNode
  initialSession: Session | null
}) {
  return (
    <TamaguiThemeProvider>
      <SafeAreaProvider>
        <SolitoImageProvider>
          <ToastProvider swipeDirection="horizontal" duration={6000} native={['mobile']}>
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
