import { YStack, useToastController } from '@t4/ui'
import { useRouter } from 'solito/router'
import { PasswordResetComponent } from '@t4/ui/src/PasswordReset'
import { isExpoGo } from 'app/utils/flags'
import { useSupabase } from 'app/utils/supabase/hooks/useSupabase'

export function UpdatePasswordScreen() {
  const { push } = useRouter()
  const toast = useToastController()
  const supabase = useSupabase()

  const handlePasswordUpdateWithPress = async (password) => {
    const { error } = await supabase.auth.updateUser({ password })
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
      <PasswordResetComponent type="password" handleWithPress={handlePasswordUpdateWithPress} />
    </YStack>
  )
}
