import { YStack, useToastController } from '@t4/ui'
import { PasswordResetComponent } from '@t4/ui/src/PasswordReset'
import { useSupabase } from 'app/utils/supabase/hooks/useSupabase'
import { useRouter } from 'solito/router'

export function UpdatePasswordScreen() {
  const { push } = useRouter()
  const toast = useToastController()
  const supabase = useSupabase()

  const handlePasswordUpdateWithPress = async (password) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      toast.show('Password change failed', {
        description: error.message,
      })
      console.log('Password change failed', error)
      return
    }
    push('/')
  }

  return (
    <YStack flex={1} justifyContent='center' alignItems='center' space>
      <PasswordResetComponent type='password' handleWithPress={handlePasswordUpdateWithPress} />
    </YStack>
  )
}
