import { UpdatePasswordScreen } from 'app/features/password-reset/update-password/screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Update Password',
        }}
      />
      <UpdatePasswordScreen />
    </>
  )
}
