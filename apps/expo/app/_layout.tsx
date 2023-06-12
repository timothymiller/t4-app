import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Provider } from 'app/provider'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { SolitoImageProvider } from 'solito/image'

const imageURL = process.env.NEXT_PUBLIC_APP_URL as `http:${string}` | `https:${string}`

export default function HomeLayout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })
  const scheme = useColorScheme()

  if (!loaded) {
    return <SplashScreen />
  }

  return (
    <Provider>
      {/* Uncomment if you want to use server optimized images */}
      <SolitoImageProvider nextJsURL={imageURL}>
        <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack />
        </ThemeProvider>
      </SolitoImageProvider>
    </Provider>
  )
}
