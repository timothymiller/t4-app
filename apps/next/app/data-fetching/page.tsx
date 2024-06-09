import { DataFetchingScreen } from 'app/features/data-fetching/screen'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Data Fetching',
}

export default function Page() {
  return <DataFetchingScreen />
}
