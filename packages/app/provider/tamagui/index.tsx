import { TamaguiProvider as TamaguiProviderOG } from '@t4/ui'
import config from '../../tamagui.config'
import { useRootTheme } from '../theme'

export const TamaguiProvider = ({ children }: { children: React.ReactNode }): React.ReactNode => {
  const [currentTheme] = useRootTheme()

  return (
    <TamaguiProviderOG
      config={config}
      disableInjectCSS
      disableRootThemeClass
      defaultTheme={currentTheme}
    >
      {children}
    </TamaguiProviderOG>
  )
}
