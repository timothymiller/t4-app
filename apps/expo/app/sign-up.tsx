import { SignUpScreen } from 'app/features/sign-up/screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Sign Up',
        }}
      />
      <SignUpScreen />
    </>
  )
}
