import { FlashList } from '@shopify/flash-list'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useColorScheme } from 'react-native'

interface ListProps {
  data: any[]
  renderItem: (item: any) => JSX.Element
  itemHeight: number
}

export function VirtualList({ data, renderItem, itemHeight }: ListProps) {
  const { top, bottom } = useSafeAreaInsets()
  const scheme = useColorScheme()
  const isLight = scheme === 'light'

  return (
    <FlashList
      data={data}
      contentContainerStyle={{
        backgroundColor: !isLight ? '#000' : '#fff',
        paddingTop: top,
        paddingBottom: bottom,
      }}
      renderItem={renderItem}
      estimatedItemSize={itemHeight}
    />
  )
}
