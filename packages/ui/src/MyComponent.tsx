import { styled, YStack, type TamaguiComponent } from 'tamagui'

export const MyComponent: TamaguiComponent = styled(YStack, {
  name: 'MyComponent',
  backgroundColor: 'red',

  variants: {
    blue: {
      true: {
        backgroundColor: 'blue',
      },
    },
  } as const,
})
