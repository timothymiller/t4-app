import Constants from 'expo-constants'

let localhost: string | undefined
const PROTOCOL = 'http:'
const localhostRegex = new RegExp(`${PROTOCOL}\/\/localhost:`, 'g')

export function getLocalhost() {
  if (localhost !== undefined) {
    return localhost
  }
  const debuggerHost = Constants.expoConfig?.hostUri
  localhost = debuggerHost?.split(':')[0] ?? 'localhost'
  return localhost
}

export function replaceLocalhost(address: string) {
  return address.replace(localhostRegex, () => `${PROTOCOL}//${getLocalhost()}:`)
}
