import { NextThemeProvider, useRootTheme, ColorScheme } from '@tamagui/next-theme'

export const TamaguiThemeProvider = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode => {
  const [_, setTheme] = useRootTheme()

  return (
    <NextThemeProvider
      onChangeTheme={(next) => {
        type NewType = ColorScheme

        setTheme(next as NewType)
      }}
    >
      {children}
    </NextThemeProvider>
  )
}

export { useRootTheme, useThemeSetting } from '@tamagui/next-theme'
