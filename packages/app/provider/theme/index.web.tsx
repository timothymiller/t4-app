import { NextThemeProvider, useRootTheme, ColorScheme } from '@tamagui/next-theme'

export const TamaguiThemeProvider = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode => {
  const [_, setRootTheme] = useRootTheme()

  return (
    <NextThemeProvider
      onChangeTheme={(next) => {
        setRootTheme(next as ColorScheme)
      }}
    >
      {children}
    </NextThemeProvider>
  )
}

export { useRootTheme, useThemeSetting } from '@tamagui/next-theme'
