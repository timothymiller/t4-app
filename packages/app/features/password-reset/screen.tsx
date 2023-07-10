import { YStack } from '@t4/ui'
import { useRouter } from 'solito/router'
import { PasswordResetComponent } from '@t4/ui/src/PasswordReset'
import { sendPasswordResetEmail } from 'app/utils/supabase/auth'

export function PasswordResetScreen() {
  const { push } = useRouter()

  const handleEmailWithPress = async (emailOrPassword) => {
    // Email for the password reset
    const { error } = await sendPasswordResetEmail(emailOrPassword)
    if (error) {
      console.log('Password reset request failed', error)
      return
    }

    push('/')
  }

  return (
    <YStack f={1} jc="center" ai="center" space>
      <PasswordResetComponent type="email" handleWithPress={handleEmailWithPress} />
    </YStack>
  )
}
