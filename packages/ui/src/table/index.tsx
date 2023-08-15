import { Car } from '@t4/api/src/db/schema'
import { YStack, H1, H2 } from 'tamagui'

type Props = {
  data: Car[]
}

export const Table = ({ data }: Props): React.ReactNode => {
  return (
    <YStack>
      <H1>Work in progress</H1>
      <H2>Fetched {data.length} items</H2>
    </YStack>
  )
}
