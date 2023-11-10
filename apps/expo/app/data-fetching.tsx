import { DataFetchingScreen } from 'app/features/data-fetching/screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Data Fetching',
        }}
      />
      <DataFetchingScreen />
    </>
  )
}
