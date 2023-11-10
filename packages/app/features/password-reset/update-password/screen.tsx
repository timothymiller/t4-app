import { YStack, useToastController } from '@t4/ui'
import { PasswordResetComponent } from '@t4/ui/src/PasswordReset'
import { useRouter } from 'solito/router'
import { submitNewPassword } from 'supertokens-web-js/recipe/thirdpartyemailpassword'

export function UpdatePasswordScreen() {
  const { push } = useRouter()
  const toast = useToastController()

  const handlePasswordUpdateWithPress = async (password) => {
    try {
      const { status } = await submitNewPassword({
        formFields: [
          {
            id: 'password',
            value: password,
          },
        ],
      })
      if (status === 'OK') {
        toast.show(`Your password has been updated!`)
        push('/')
      } else {
        toast.show(`Oops! Something went wrong.`)
      }
    } catch (err) {
      console.log('Password update request failed', err)
      toast.show('Password update request failed')
    }
  }

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" space>
      <PasswordResetComponent type="password" handleWithPress={handlePasswordUpdateWithPress} />
    </YStack>
  )
}
