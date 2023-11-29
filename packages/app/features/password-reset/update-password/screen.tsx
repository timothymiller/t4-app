import { YStack, useToastController } from '@t4/ui'
import { PasswordResetComponent } from '@t4/ui/src/PasswordReset'
import { getApiUrl as getExpoAPIUrl } from 'app/utils/trpc'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'

const { useParam } = createParam<{
  token: string
  rid: string
  tenantId: string
}>()

export function UpdatePasswordScreen() {
  const { push } = useRouter()
  const toast = useToastController()
  const [token] = useParam('token')
  const [rid] = useParam('rid')

  const handlePasswordUpdateWithPress = async (password: string) => {
    try {
      const API_URL = `${process.env.NEXT_PUBLIC_API_URL ?? getExpoAPIUrl()}`

      const res = (await fetch(`${API_URL}/api/auth/user/password/reset`, {
        method: 'POST',
        headers: {
          rid: 'thirdpartyemailpassword',
        },
        body: JSON.stringify({
          method: 'token',
          token,
          formFields: [
            {
              id: 'password',
              value: password,
            },
          ],
        }),
      }).then((res) => res.json())) as { status: string }

      if (res.status === 'OK') {
        toast.show('Your password has been updated!')
        push('/')
      } else {
        toast.show('Failed to update password!')
      }
    } catch (error) {
      toast.show('Oops! Something went wrong.')
    }
  }

  return (
    <YStack flex={1} justifyContent='center' alignItems='center' space>
      <PasswordResetComponent type='password' handleWithPress={handlePasswordUpdateWithPress} />
    </YStack>
  )
}
