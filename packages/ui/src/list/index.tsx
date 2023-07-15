import { FlashList } from '@shopify/flash-list'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useColorScheme } from 'react-native'

interface Props {
  data: any[]
  renderItem: (item: any) => React.ReactElement
  itemHeight: number
}

export const VirtualList = ({ data, renderItem, itemHeight }: Props): React.ReactNode => {
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
