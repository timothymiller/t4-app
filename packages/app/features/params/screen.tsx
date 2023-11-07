import { Button, H2, Paragraph, YStack } from '@t4/ui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { createParam } from 'solito'
import { useLink } from 'solito/link'

const { useParam } = createParam<{ id: string }>()

export const ParamsScreen = (): React.ReactNode => {
  const [id] = useParam('id')
  const link = useLink({
    href: '/',
  })

  return (
    <YStack flex={1} justifyContent='center' alignItems='center' space>
      <H2 textAlign='center' space='$4'>
        This value is passed via params
      </H2>
      <Paragraph textAlign='center' fontWeight='700'>{`User ID: ${id}`}</Paragraph>
      <Button {...link} icon={ChevronLeft}>
        Go Home
      </Button>
    </YStack>
  )
}
