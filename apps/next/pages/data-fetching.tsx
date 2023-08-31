import { DataFetchingScreen } from 'app/features/data-fetching/screen'
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>Data Fetching</title>
      </Head>
      <DataFetchingScreen />
    </>
  )
}
