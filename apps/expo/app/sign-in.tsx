import { SignInScreen } from 'app/features/sign-in/screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Sign In',
        }}
      />
      <SignInScreen />
    </>
  )
}
