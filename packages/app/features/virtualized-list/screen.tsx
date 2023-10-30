import type { Car } from '@t4/api/src/db/schema'
import { Paragraph, Spinner, VirtualList, YStack } from '@t4/ui'
import { formatNumber, formatPrice } from 'app/utils/number'
import { trpc } from 'app/utils/trpc'
import React from 'react'
import { SolitoImage } from 'solito/image'

export const VirtualizedListScreen = (): React.ReactNode => {
  const query = trpc.car.all.useQuery()

  return (
    <YStack fullscreen f={1}>
      {query.isInitialLoading && !query.error ? (
        // Loading
        <YStack fullscreen f={1} jc="center" ai="center">
          <Paragraph pb="$3">Loading...</Paragraph>
          <Spinner />
        </YStack>
      ) : query.data?.length ? (
        // Has Data
        <VirtualList data={query.data} renderItem={CarListItem} itemHeight={80} />
      ) : query.error ? (
        // Error
        <YStack fullscreen f={1} jc="center" ai="center" p="$6">
          <Paragraph pb="$3">Error fetching cars</Paragraph>
          <Paragraph>{query.error.message}</Paragraph>
        </YStack>
      ) : (
        // Empty State
        <YStack fullscreen f={1} jc="center" ai="center">
          <Paragraph>No cars found.</Paragraph>
        </YStack>
      )}
    </YStack>
  )
}

const CarListItem = (item: Car): React.ReactElement => {
  return (
    <YStack flexDirection="row" paddingLeft="$2">
      <SolitoImage
        src="/t4-logo.png"
        width={56}
        height={56}
        alt="T4 Logo"
        style={{
          marginTop: 8,
        }}
      />
      <YStack>
        <Paragraph paddingTop="$2" paddingLeft="$3" paddingBottom="$1" fontSize={16}>
          {item.make + ' ' + item.model}
        </Paragraph>
        <Paragraph paddingLeft="$3" fontSize={16} opacity={0.6}>
          {item.color} - {item.year} - {formatNumber(item.mileage)} miles -{' '}
          {formatPrice(item.price)}
        </Paragraph>
      </YStack>
    </YStack>
  )
}
