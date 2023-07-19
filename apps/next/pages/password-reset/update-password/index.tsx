import Head from 'next/head'
import { UpdatePasswordScreen } from 'app/features/password-reset/update-password/screen'

export default function Page() {
  return (
    <>
      <Head>
        <title>Password Reset</title>
      </Head>
      <UpdatePasswordScreen />
    </>
  )
}
