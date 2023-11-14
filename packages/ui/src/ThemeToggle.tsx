import { Monitor, Moon, Sun } from '@tamagui/lucide-icons'
import { useThemeSetting } from '@tamagui/next-theme'
import { useState } from 'react'
import type { ButtonProps } from 'tamagui'
import { Button, useIsomorphicLayoutEffect } from 'tamagui'

const icons = {
  system: Monitor,
  light: Sun,
  dark: Moon,
}
export const ThemeToggle = (props: ButtonProps) => {
  const themeSetting = useThemeSetting()
  const [clientTheme, setClientTheme] = useState('system')

  useIsomorphicLayoutEffect(() => {
    setClientTheme(themeSetting.current || 'system')
  }, [themeSetting.current])

  return (
    <Button
      size='$4'
      onPress={themeSetting.toggle}
      aria-label='Toggle color scheme'
      icon={icons[clientTheme]}
      {...props}
    />
  )
}
