'use client'

import { Paragraph, YStack } from '@t4/ui'

export function SSRTestScreen(props: { content: string }) {
  return (
    <YStack flex={1}>
      <Paragraph role='heading'>
        {props.content}
      </Paragraph>
    </YStack>
  )
}
