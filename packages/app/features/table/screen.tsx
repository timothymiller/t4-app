import { H1, Paragraph, YStack } from '@t4/ui'
import { trpc } from 'app/utils/trpc'
import { Table } from '@t4/ui/src/table'

export const TableScreen = (): React.ReactNode => {
  const allCars = trpc.car.all.useQuery()
  const isError =
    allCars?.failureReason?.data?.httpStatus !== 200 &&
    allCars?.failureReason?.data?.httpStatus !== undefined

  return (
    <YStack f={1} jc="center" ai="center" p="$4" space="$4">
      <H1>🛞 Vehicles Table</H1>
      {allCars.isLoading && <Paragraph>Loading...</Paragraph>}
      {isError && <Paragraph>{allCars.error?.data?.code}</Paragraph>}
      {allCars.data && <Table data={allCars.data} />}
    </YStack>
  )
}
