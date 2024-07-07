import { Monitor, Moon, Sun } from '@tamagui/lucide-icons'
import type { ButtonProps } from 'tamagui'
import { useAppTheme } from 'app/atoms/theme'
import { Button, useIsomorphicLayoutEffect } from 'tamagui'
import { useState } from 'react'

const icons = {
  system: <Monitor />,
  light: <Sun />,
  dark: <Moon />,
}

export const ThemeToggle = (props: ButtonProps) => {
  const [appTheme, setAppTheme] = useAppTheme()
  const [clientTheme, setClientTheme] = useState('system')

  useIsomorphicLayoutEffect(() => {
    setClientTheme(appTheme || 'system')
  }, [appTheme])

  const toggleTheme = () => {
    setAppTheme(prevTheme => {
      if (prevTheme === 'system') return 'light'
      if (prevTheme === 'light') return 'dark'
      return 'system'
    })
  }

  return (
    <Button
      size='$4'
      onPress={toggleTheme}
      aria-label='Toggle color scheme'
      icon={icons[clientTheme]}
      {...props}
    />
  )
}
