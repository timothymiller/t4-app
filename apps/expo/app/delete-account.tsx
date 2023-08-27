import { DeleteAccountScreen } from 'app/features/delete-account/screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Delete Account',
        }}
      />
      <DeleteAccountScreen />
    </>
  )
}
