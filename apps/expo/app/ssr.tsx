import { SSRScreen } from 'app/features/ssr/screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Server Side Rendering',
        }}
      />
      <SSRScreen />
    </>
  )
}
