import { YStack, useToastController } from '@t4/ui'
import { PasswordResetComponent } from '@t4/ui/src/PasswordReset'
import { isAndroid, isIos } from '@tamagui/core'
import { useRouter } from 'solito/router'
import { sendPasswordResetEmail } from 'supertokens-web-js/recipe/thirdpartyemailpassword'

export function PasswordResetScreen() {
  const { push } = useRouter()
  const toast = useToastController()

  const handleEmailWithPress = async (email) => {
    try {
      const { status } = await sendPasswordResetEmail({
        formFields: [
          {
            id: 'email',
            value: email,
          },
        ],
        options: {
          async preAPIHook(input) {
            return {
              ...input,
              requestInit: {
                ...input.requestInit,
                headers: {
                  ...input.requestInit.headers,
                  'X-Platform': isAndroid ? 'android' : isIos ? 'ios' : 'web',
                },
              },
            }
          },
        },
      })

      if (status === 'PASSWORD_RESET_NOT_ALLOWED') {
        // this can happen due to automatic account linking. Please see - supertokens account linking docs
        toast.show('Password reset is not allowed for this email! Please contact support!')
      } else if (status === 'FIELD_ERROR') {
        toast.show('Invalid email!')
      } else {
        toast.show('A password reset email has been sent to your email if it exists in our system!')
        push('/')
      }
    } catch (error) {
      toast.show('Password reset request failed', {
        description: error.message,
      })
    }
  }

  return (
    <YStack flex={1} justifyContent='center' alignItems='center' space>
      <PasswordResetComponent type='email' handleWithPress={handleEmailWithPress} />
    </YStack>
  )
}
