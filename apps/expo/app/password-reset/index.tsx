import { PasswordResetScreen } from 'app/features/password-reset/screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Reset Password',
        }}
      />
      <PasswordResetScreen />
    </>
  )
}
