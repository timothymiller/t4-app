import { FlashList } from '@shopify/flash-list'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Props {
  data: any[]
  renderItem: (item: any) => React.ReactElement
  itemHeight: number
}

export function VirtualList<T>({ data, renderItem, itemHeight }: Props): React.ReactNode {
  const { top, bottom } = useSafeAreaInsets()

  return (
    <FlashList
      data={data}
      contentContainerStyle={{
        paddingTop: top,
        paddingBottom: bottom,
      }}
      renderItem={renderItem}
      estimatedItemSize={itemHeight}
    />
  )
}
