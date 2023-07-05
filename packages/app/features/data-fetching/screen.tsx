import { H1, H2, Paragraph, YStack } from '@t4/ui'
import React from 'react'
import { trpc } from 'app/utils/trpc'

export function DataFetchingScreen() {
  const helloWorld = trpc.hello.world.useQuery()
  const protectedRoute = trpc.auth.secretMessage.useQuery()

  return (
    <YStack f={1} jc="center" ai="center" p="$4" space="$4">
      <H1>Data Fetching</H1>

      <H2>Public Route</H2>
      {helloWorld.isLoading && <Paragraph>Loading...</Paragraph>}
      {helloWorld.error && <Paragraph>{protectedRoute.error?.data?.code}</Paragraph>}
      {helloWorld.data && <Paragraph>{helloWorld.data}</Paragraph>}

      <H2>Protected Route</H2>
      {protectedRoute.isLoading && <Paragraph>Loading...</Paragraph>}
      {protectedRoute.error && <Paragraph>{protectedRoute.error?.data?.code}</Paragraph>}
      {protectedRoute.data && <Paragraph>{protectedRoute.data}</Paragraph>}
    </YStack>
  )
}
