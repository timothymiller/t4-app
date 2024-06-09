import { VirtualizedListScreen } from 'app/features/virtualized-list/screen'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Virtualized List',
}

export default function Page() {
  return <VirtualizedListScreen />
}
