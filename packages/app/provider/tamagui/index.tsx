import { useCurrentTheme } from 'app/atoms/theme'
import config from '../../tamagui.config'
import { TamaguiProvider as TamaguiProviderOG } from '@t4/ui'

export const TamaguiProvider = ({ children }: { children: React.ReactNode }): React.ReactNode => {
  const [currentTheme] = useCurrentTheme()

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
