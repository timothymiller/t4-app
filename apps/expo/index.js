import 'react-native-url-polyfill/auto'
// ^^ Remove after upgrade to Expo v50
// https://github.com/expo/expo/pull/24941
import 'expo-router/entry'
import { LogBox } from 'react-native'
console.disableYellowBox = true
LogBox.ignoreAllLogs()
