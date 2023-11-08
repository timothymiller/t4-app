import { H1, H2, Paragraph, YStack } from '@t4/ui'
import { trpc } from 'app/utils/trpc'
import React from 'react'
import { match } from 'ts-pattern'
import { error, loading, success } from '../../utils/trpc/patterns'

export function DataFetchingScreen() {
  const helloWorld = trpc.hello.world.useQuery<string>('world')
  const helloWorldLayout = match(helloWorld)
    .with(error, () => <Paragraph>{helloWorld.failureReason?.message}</Paragraph>)
    .with(loading, () => <Paragraph>Loading...</Paragraph>)
    .with(success, () => <Paragraph>{helloWorld.data}</Paragraph>)
    .otherwise(() => <Paragraph>{helloWorld.failureReason?.message}</Paragraph>)

  const protectedRoute = trpc.auth.secretMessage.useQuery<string>()
  const protectedRouteLayout = match(protectedRoute)
    .with(error, () => <Paragraph>{protectedRoute.failureReason?.message}</Paragraph>)
    .with(loading, () => <Paragraph>Loading...</Paragraph>)
    .with(success, () => <Paragraph>{protectedRoute.data}</Paragraph>)
    .otherwise(() => <Paragraph>{protectedRoute.failureReason?.message}</Paragraph>)

  return (
    <YStack f={1} jc='center' ai='center' p='$4' space='$4'>
      <H1>Data Fetching</H1>
      <H2>Public Route</H2>
      {helloWorldLayout}
      <H2>Protected Route</H2>
      {protectedRouteLayout}
    </YStack>
  )
}
