import { Paragraph, YStack } from '@t4/ui'
import { GetServerSideProps } from 'next'

export const runtime = 'experimental-edge'

export const getServerSideProps = (async () => {
  return { props: { content: 'This content is sent from the server' } }
}) satisfies GetServerSideProps<{ content: string }>

export default function Page(props: { content: string }) {
  return (
    <YStack flex={1}>
      <Paragraph role='heading'>Server-side rendering</Paragraph>
      <Paragraph>{props.content}</Paragraph>
    </YStack>
  )
}
