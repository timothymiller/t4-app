import { H1, H2, Paragraph, YStack } from '@t4/ui'
import React from 'react'
import { trpc } from 'app/utils/trpc'
import type { Car } from '@t4/api/src/db/schema'

export function DataFetchingScreen() {
  const helloWorld = trpc.hello.world.useQuery<string>('world')
  const protectedRoute = trpc.auth.secretMessage.useQuery<string>()
  const isError =
    protectedRoute?.failureReason?.data?.httpStatus !== 200 &&
    protectedRoute?.failureReason?.data?.httpStatus !== undefined

  const allCars = trpc.car.all.useQuery<Car[]>()

  return (
    <YStack f={1} jc="center" ai="center" p="$4" space="$4">
      <H1>Data Fetching</H1>

      <H2>Public Route</H2>
      {helloWorld.isLoading && <Paragraph>Loading...</Paragraph>}
      {helloWorld.error && <Paragraph>{protectedRoute.error?.data?.code}</Paragraph>}
      {helloWorld.data && !helloWorld.error && <Paragraph>{helloWorld.data}</Paragraph>}

      <H2>Protected Route</H2>
      {protectedRoute.isLoading && !isError && <Paragraph>Loading...</Paragraph>}
      {isError && <Paragraph>{protectedRoute?.failureReason?.message}</Paragraph>}
      {protectedRoute.data && !isError && <Paragraph>{protectedRoute.data}</Paragraph>}
    </YStack>
  )
}
