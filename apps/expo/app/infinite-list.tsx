import { InfiniteListScreen } from 'app/features/infinite-list/screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Infinite List',
        }}
      />
      <InfiniteListScreen />
    </>
  )
}
