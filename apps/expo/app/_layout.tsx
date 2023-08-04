import { Provider } from 'app/provider'
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { SolitoImageProvider } from 'solito/image'
import { useEffect } from 'react'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from 'app/utils/supabase'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

const imageURL = process.env.NEXT_PUBLIC_APP_URL as `http:${string}` | `https:${string}`

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()

  const [loaded, error] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Provider>
        <SolitoImageProvider nextJsURL={imageURL}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack />
          </ThemeProvider>
        </SolitoImageProvider>
      </Provider>
    </SessionContextProvider>
  )
}
