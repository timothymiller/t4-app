export const ThemeVariant = {
  light: 'light',
  dark: 'dark',
  system: 'system',
} as const

export type ThemeVariant = keyof typeof ThemeVariant

export type CurrentThemeVariant = 'light' | 'dark'
