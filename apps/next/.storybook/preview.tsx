import { useColorScheme } from "react-native";
import { TamaguiProvider, Theme } from "tamagui";
import { initialWindowMetrics } from 'app/provider'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { SolitoImageProvider } from 'solito/image'
import config from "../tamagui.config";
import React from "react";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const imageURL = process.env.NEXT_PUBLIC_APP_URL as `http:${string}` | `https:${string}`

export const decorators = [
  (Story) => {
    const colorScheme = useColorScheme();
    return (
      <TamaguiProvider config={config}>
        <Theme name={colorScheme === "dark" ? "dark" : "light"}>
          <SolitoImageProvider
            loader={({ quality, width, src }) => {
              return `${imageURL}${src}?w=${width}&q=${quality}`
            }}
          >
            <SafeAreaProvider initialMetrics={initialWindowMetrics}><Story /></SafeAreaProvider>
          </SolitoImageProvider> 
        </Theme>
      </TamaguiProvider>
    );
  },
];