import { VirtualizedListScreen } from 'app/features/virtualized-list/screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Virtualized List',
        }}
      />
      <VirtualizedListScreen />
    </>
  )
}
