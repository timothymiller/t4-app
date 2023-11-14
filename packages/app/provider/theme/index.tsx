import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useForceUpdate } from '@t4/ui'
import { appThemeKey, useAppTheme, useCurrentTheme } from 'app/atoms/theme'
import { ThemeVariant } from 'app/utils/theme'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useLayoutEffect } from 'react'
import { Appearance } from 'react-native'
import { storage } from '../kv'

export const TamaguiThemeProvider = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode => {
  const [appTheme, setAppTheme] = useAppTheme()
  const [currentTheme] = useCurrentTheme()
  const forceUpdate = useForceUpdate()

  const defaultTheme = 'system'
  const statusBarStyle = currentTheme === ThemeVariant.dark ? ThemeVariant.light : ThemeVariant.dark
  const themeValue = currentTheme === ThemeVariant.dark ? DarkTheme : DefaultTheme

  useEffect(() => {
    const systemThemeChangeListener = Appearance.addChangeListener(() => {
      setAppTheme(Appearance.getColorScheme() as ThemeVariant)
      forceUpdate()
    })
    return () => {
      systemThemeChangeListener.remove()
    }
  }, [setAppTheme, forceUpdate])

  useLayoutEffect(() => {
    const savedAppTheme = storage.getString(appThemeKey)
    if (savedAppTheme !== undefined) {
      setAppTheme(savedAppTheme as ThemeVariant)
    }
  }, [setAppTheme])

  useEffect(() => {
    if (appTheme === undefined) {
      storage.set(appThemeKey, defaultTheme)
      setAppTheme(defaultTheme)
    } else {
      storage.set(appThemeKey, appTheme)
    }
  }, [appTheme, setAppTheme])

  return (
    <ThemeProvider value={themeValue}>
      <StatusBar style={statusBarStyle} />
      {children}
    </ThemeProvider>
  )
}

export const useRootTheme = () => {
  const [currentTheme] = useCurrentTheme()
  return [currentTheme]
}
