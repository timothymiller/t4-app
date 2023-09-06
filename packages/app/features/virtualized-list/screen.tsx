import { ListRenderItemInfo } from '@shopify/flash-list'
import type { Car } from '@t4/api/src/db/schema'
import { Button, Paragraph, Spinner, VirtualList, YStack } from '@t4/ui'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { useThemeSetting } from 'app/provider/theme'
import { formatNumber, formatPrice } from 'app/utils/number'
import { trpc } from 'app/utils/trpc'
import { BlurView } from 'expo-blur'
import { SolitoImage } from 'solito/image'
import { useLink } from 'solito/link'

const HEADER_HEIGHT = 44

export const VirtualizedListScreen = (): React.ReactNode => {
  const query = trpc.car.all.useQuery()
  const backLink = useLink({
    href: '/',
  })
  const { resolvedTheme: themeName } = useThemeSetting()

  return (
    <YStack flex={1} className="h-100dvh">
      <BlurView
        style={{
          backgroundColor: 'transparent',
          top: 0,
          right: 0,
          left: 0,
          position: 'absolute',
          zIndex: 20,
        }}
        tint={themeName}
      >
        <Button {...backLink} icon={ArrowLeft} chromeless br="$0" jc="flex-start">
          Back
        </Button>
      </BlurView>
      {query.data?.length ? (
        <VirtualList
          data={query.data}
          renderItem={CarListItem}
          estimatedItemSize={80}
          contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 16 }}
        />
      ) : (
        <YStack fullscreen flex={1} pt={HEADER_HEIGHT + 16} px="$3">
          {query.status === 'loading' && <Spinner />}
          {query.status === 'error' && (
            <Paragraph>Error fetching cars: {query.error.message}</Paragraph>
          )}
          {query.status === 'success' && <Paragraph>No cars found.</Paragraph>}
        </YStack>
      )}
    </YStack>
  )
}

const CarListItem = ({ item: car }: ListRenderItemInfo<Car>): React.ReactElement => {
  // Note if you useState in a renderItem, you need to make sure it resets if the item changes
  // https://shopify.github.io/flash-list/docs/recycling
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
          {car.make + ' ' + car.model}
        </Paragraph>
        <Paragraph paddingLeft="$3" fontSize={16} opacity={0.6}>
          {car.color} - {car.year} - {formatNumber(car.mileage)} miles - {formatPrice(car.price)}
        </Paragraph>
      </YStack>
    </YStack>
  )
}
