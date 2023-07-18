import { createAnimations } from '@tamagui/animations-react-native'
// import type { AnimationDriver } from '@tamagui/web'

// TODO: Where is AnimationConfig exported from?
// TODO: Should be AnimationDriver<AnimationConfig<any>>
export const animations: any = createAnimations({
  bouncy: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  lazy: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
  quick: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
})
