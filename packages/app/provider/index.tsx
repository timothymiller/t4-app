import { Session } from '@supabase/supabase-js'
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
  initialSession,
}: {
  children: React.ReactNode
  initialSession: Session | null
}) {
  return (
    <TamaguiThemeProvider>
      <TamaguiProvider>
        <SafeAreaProvider>
          <SolitoImageProvider>
            <ToastProvider swipeDirection='horizontal' duration={6000} native={['mobile']}>
              <AuthProvider initialSession={initialSession}>
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
