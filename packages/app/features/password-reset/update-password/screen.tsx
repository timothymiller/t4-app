'use client'

import { YStack, useToastController } from '@t4/ui'
import { PasswordResetComponent } from '@t4/ui/src/PasswordReset'
import { useRouter, useSearchParams } from 'solito/navigation'
import { createParam } from 'solito'
import { useSessionRedirect, useSignIn } from 'app/utils/auth'
import { TRPCClientError } from '@trpc/client'

type Params = {
  code?: string
  email?: string
}

export function UpdatePasswordScreen() {
  const toast = useToastController()
  const params = useSearchParams<Params>()
  const { push } = useRouter()
  const { signIn } = useSignIn()
  useSessionRedirect({ true: '/' })

  const handlePasswordUpdateWithPress = async (password) => {
    const email = params?.get('email')
    const code = params?.get('code')
    if (!email || !code) {
      toast.show(
        'Sorry, the update password link is missing params. Try resetting your password again.'
      )
      push('/password-reset')
      return
    }

    try {
      await signIn({ email, code, password })
    } catch (error) {
      if (
        error instanceof TRPCClientError &&
        error.data?.httpStatus &&
        error.data.httpStatus < 500
      ) {
        toast.show(error.message)
      } else {
        toast.show('Password change failed', {
          description: error.message,
        })
      }
      console.log('Password change failed', error)
    }
  }

  return (
    <YStack flex={1} justifyContent='center' alignItems='center' space>
      <PasswordResetComponent type='password' handleWithPress={handlePasswordUpdateWithPress} />
    </YStack>
  )
}
