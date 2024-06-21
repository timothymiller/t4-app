import { LegendOfflineFirstScreen } from 'app/features/legend-offline-first/screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Legend Offline First',
        }}
      />
      <LegendOfflineFirstScreen />
    </>
  )
}
