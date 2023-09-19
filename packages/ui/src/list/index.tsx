import { FlashList } from '@shopify/flash-list'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCallback } from 'react'

interface Props {
  data: any[]
  renderItem: (item: any) => React.ReactElement
  itemHeight: number
}

export function VirtualList<T>({ data, renderItem, itemHeight }: Props): React.ReactNode {
  const { top, bottom } = useSafeAreaInsets()

  // FlashList's API is awkward.
  const render = useCallback(
    (item) => {
      return renderItem(item.item)
    },
    [renderItem]
  )

  return (
    <FlashList
      data={data}
      contentContainerStyle={{
        paddingTop: top,
        paddingBottom: bottom,
      }}
      renderItem={render}
      estimatedItemSize={itemHeight}
    />
  )
}
