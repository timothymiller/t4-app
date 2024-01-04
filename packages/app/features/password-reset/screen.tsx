'use client'

import { YStack, useToastController } from '@t4/ui'
import { PasswordResetComponent } from '@t4/ui/src/PasswordReset'
import { useSessionRedirect, useSignIn } from 'app/utils/auth'
import { TRPCClientError } from '@trpc/client'
import { useRouter } from 'solito/navigation'

export function PasswordResetScreen() {
  const { push } = useRouter()
  const toast = useToastController()
  const { signIn } = useSignIn()
  useSessionRedirect({ true: '/' })

  const handleEmailWithPress = async (email: string) => {
    try {
      // Send email with the password reset link
      const res = await signIn({ email })
      toast.show('Password reset email sent')
      push('/sign-in')
    } catch (error) {
      if (error) {
        if (
          error instanceof TRPCClientError &&
          error.data?.httpStatus &&
          error.data.httpStatus < 500
        ) {
          toast.show(error.message)
        } else {
          toast.show('Password reset request failed', {
            description: error.message,
          })
        }
        console.log('Password reset request failed', error)
      }
    }
  }

  return (
    <YStack flex={1} justifyContent='center' alignItems='center' space>
      <PasswordResetComponent type='email' handleWithPress={handleEmailWithPress} />
    </YStack>
  )
}
