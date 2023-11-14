import { Anchor, Button, H1, Paragraph, XStack, YStack } from '@t4/ui'
import { RotateCw } from '@tamagui/lucide-icons'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SolitoImage } from 'solito/image'

const customerCareEmail = process.env.NEXT_PUBLIC_CUSTOMER_CARE_EMAIL

export default function Page() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Page not found</title>
      </Head>
      <YStack flex={1} justifyContent='center' alignItems='center' padding='$4' space='$4'>
        <SolitoImage src='/t4-logo.png' width={96} height={96} alt='T4 Logo' />
        <H1>Page not found</H1>
        <Paragraph maxWidth={500}>
          Your changes were saved, but we could not load the page you requested because it was not
          found on our server. Please try connecting again. If the issue keeps happening,{' '}
          <Anchor href={`mailto:${customerCareEmail}`} target='_blank' rel='noreferrer'>
            contact Customer Care
          </Anchor>
          .
        </Paragraph>
        <XStack padding='$4'>
          <Button icon={<RotateCw />} onPress={() => router.reload()}>
            Try Again
          </Button>
        </XStack>
      </YStack>
    </>
  )
}
