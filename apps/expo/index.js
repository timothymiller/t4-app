import 'expo-router/entry'
import { LogBox } from 'react-native'
import { LogBox } from 'react-native'
import { enableLegendStateReact } from '@legendapp/state/react'
console.disableYellowBox = true

LogBox.ignoreAllLogs()
enableLegendStateReact()
