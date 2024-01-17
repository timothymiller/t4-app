'use client'

import { useServerInsertedHTML } from 'next/navigation'
import { StyleSheet } from 'react-native'

import Tamagui from '../tamagui.config'

export function StylesProvider({ children }: { children: React.ReactNode }) {
  useServerInsertedHTML(() => {
    // @ts-ignore RN doesn't have this type
    const sheet = StyleSheet.getSheet()
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: sheet.textContent }} id={sheet.id} />
        <style
          key='tamagui-css'
          dangerouslySetInnerHTML={{
            __html: Tamagui.getCSS({
              exclude: process.env.NODE_ENV === 'development' ? null : 'design-system',
            }),
          }}
        />
      </>
    )
  })
  return <>{children}</>
}
