// import { useEffect, useState } from 'react'
// import { H1, H2, Paragraph, YStack } from '@t4/ui'
import { DataFetchingScreen } from 'app/features/data-fetching/screen'
import { Stack } from 'expo-router'
// import { replaceLocalhost } from 'app/utils/trpc/localhost.native'

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

// export function DataFetchingScreen() {
//   const [data, setData] = useState<Record<string, any>>({ isLoading: true })
//   useEffect(() => {
//     fetch(
//       `${replaceLocalhost('http://localhost:8787')}/trpc/hello.world?batch=1&input={%220%22:{%22json%22:%22world%22},%221%22:{%22json%22:null,%22meta%22:{%22values%22:[%22undefined%22]}}}`
//     )
//       .then((res) => res.json())
//       .then((res) => {
//         console.log('res', res)
//         setData(res as object)
//       })
//   }, [])

//   return (
//     <YStack f={1} jc="center" ai="center" p="$4" space="$4">
//       <H1>Data Fetching</H1>
//       <Paragraph>{JSON.stringify(data, null, 2)}</Paragraph>
//     </YStack>
//   )
// }
