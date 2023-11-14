import { Paragraph, YStack } from 'tamagui'

interface Props {
  message: string | undefined
}

export const CarListError = ({ message }: Props): React.ReactElement => {
  return (
    <YStack fullscreen f={1} jc='center' ai='center' p='$6'>
      <Paragraph pb='$3'>Error fetching cars</Paragraph>
      <Paragraph>{message}</Paragraph>
    </YStack>
  )
}
