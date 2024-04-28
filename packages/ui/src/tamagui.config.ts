import { createInterFont } from '@tamagui/font-inter'
import { createMedia } from '@tamagui/react-native-media-driver'
import { shorthands } from '@tamagui/shorthands'
import { tokens } from '@tamagui/themes/v2'
// import { themes } from '@tamagui/themes/v2-themes'
import { themes } from './themes'
import { createTamagui, createFont, isWeb } from 'tamagui'

import { animations } from './animations'

// const headingFont = createInterFont({
//   size: {
//     6: 15,
//   },
//   transform: {
//     6: 'uppercase',
//     7: 'none',
//   },
//   weight: {
//     6: '400',
//     7: '700',
//   },
//   color: {
//     6: '$colorFocus',
//     7: '$color',
//   },
//   letterSpacing: {
//     5: 2,
//     6: 1,
//     7: 0,
//     8: -1,
//     9: -2,
//     10: -3,
//     12: -4,
//     14: -5,
//     15: -6,
//   },
//   face: {
//     700: { normal: 'InterBold' },
//   },
// })

// const bodyFont = createInterFont(
//   {
//     face: {
//       700: { normal: 'InterBold' },
//     },
//   },
//   {
//     sizeSize: (size) => Math.round(size * 1.1),
//     sizeLineHeight: (size) => Math.round(size * 1.1 + (size > 20 ? 10 : 10)),
//   }
// )

const webFontFamily =
  'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'

const headingFont = createFont({
  family: isWeb ? webFontFamily : 'System',
  size: {
    2: 12,
    3: 14,
    4: 16,
    5: 18,
    6: 20,
    7: 24,
    8: 28,
    9: 32,
    10: 48,
  },
  lineHeight: {
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 40,
    10: 48,
  },
  transform: {
    6: 'uppercase',
    7: 'none',
  },
  weight: {
    6: '400',
    7: '700',
  },
  color: {
    6: '$colorFocus',
    7: '$color',
  },
  letterSpacing: {
    5: 3,
    6: 2,
    7: 1,
    8: 0,
    9: -1,
    10: -2,
    12: -4,
    14: -6,
    15: -7,
  },
  // face: {
  //   700: { normal: 'InterBold' },
  // },
})

const bodyFont = createFont({
  family: isWeb ? webFontFamily : 'System',
  size: {
    // 2: 12,
    // 3: 14,
    // 4: 16,
    // 5: 18,
    // 7: 22,
    // 8: 26,
    // 9: 32,
    // 10: 38,
    1: 12,
    2: 14,
    3: 12,
    4: 15,
    5: 24,
    7: 30,
    8: 36,
    9: 40,
    10: 52,
  },
  letterSpacing: {},
  weight: {
    1: '300',
    4: '400',
  },
  lineHeight: {
    1: 14,
    2: 21,
    3: 24,
    4: 27,
    5: 36,
    7: 45,
    8: 54,
    9: 60,
    10: 78,
  },
})

export const config = createTamagui({
  defaultFont: 'body',
  animations,
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  shorthands,
  fonts: {
    body: bodyFont,
    heading: headingFont,
  },
  themes,
  tokens,
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  }),
})
