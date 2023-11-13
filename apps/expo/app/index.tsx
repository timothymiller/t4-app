import './supertokens/superTokensPolyfill';
import { HomeScreen } from 'app/features/home/screen'
import { Stack } from 'expo-router'
import SuperTokens from 'supertokens-web-js'
import { config } from './supertokens/config'

SuperTokens.init(config);

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
