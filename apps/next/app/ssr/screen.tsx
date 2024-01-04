'use client'

import { Paragraph, YStack } from '@t4/ui'

export function SSRTestScreen() {
  return (
    <YStack flex={1}>
      <Paragraph role='heading'>
        This page is rendered on the edge. It is not statically rendered.
      </Paragraph>
    </YStack>
  )
}
