import { YStack, useToastController } from '@t4/ui'
import { useRouter } from 'solito/router'
import { PasswordResetComponent } from '@t4/ui/src/PasswordReset'
import { isExpoGo } from 'app/utils/flags'
import { useSessionRedirect, useSignIn } from 'app/utils/auth'
import { TRPCClientError } from '@trpc/client'

export function PasswordResetScreen() {
  const { push } = useRouter()
  const toast = useToastController()
  const { signIn } = useSignIn()
  useSessionRedirect({ true: '/' })

  const handleEmailWithPress = async (email: string) => {
    try {
      // Send email with the password reset link
      const res = await signIn({ email })
      if (!isExpoGo) {
        toast.show('Password reset email sent')
      }
      push('/login')
    } catch (error) {
      if (error) {
        if (
          error instanceof TRPCClientError &&
          error.data?.httpStatus &&
          error.data.httpStatus < 500
        ) {
          if (!isExpoGo) {
            toast.show(error.message)
          }
        } else {
          if (!isExpoGo) {
            toast.show('Password reset request failed', {
              description: error.message,
            })
          }
        }
        console.log('Password reset request failed', error)
      }
    }
  }

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" space>
      <PasswordResetComponent type="email" handleWithPress={handleEmailWithPress} />
    </YStack>
  )
}
