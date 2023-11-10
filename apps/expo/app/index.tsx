import 'app/utils/supertokens/superTokensPolyfill';
import { HomeScreen } from 'app/features/home/screen'
import { Stack } from 'expo-router'
import SuperTokens from 'supertokens-web-js'
import { nativeConfig } from 'app/utils/supertokens/nativeConfig'

SuperTokens.init(nativeConfig);

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
        }}
      />
      <HomeScreen />
    </>
  )
}
