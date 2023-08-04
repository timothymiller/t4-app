import { YStack, useToastController } from '@t4/ui'
import { useRouter } from 'solito/router'
import { PasswordResetComponent } from '@t4/ui/src/PasswordReset'
import { updatePassword } from 'app/utils/supabase/auth'
import { isExpoGo } from 'app/utils/flags'

export function UpdatePasswordScreen() {
  const { push } = useRouter()
  const toast = useToastController()

  const handlePasswordWithPress = async (password) => {
    const { error } = await updatePassword(password)
    if (error) {
      if (!isExpoGo) {
        toast.show('Password change failed', {
          description: error.message,
        })
      }
      console.log('Password change failed', error)
      return
    }

    push('/')
  }

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" space>
      <PasswordResetComponent type="password" handleWithPress={handlePasswordWithPress} />
    </YStack>
  )
}
