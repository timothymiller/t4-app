import { configureObservableSync } from '@legendapp/state/sync'
import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv'

import { enableReactNativeComponents } from '@legendapp/state/config/enableReactNativeComponents'
// React Native

enableReactNativeComponents()

// Setup global sync and persist configuration. These can be overriden
// per observable.
configureObservableSync({
  persist: {
    plugin: ObservablePersistMMKV,
    retrySync: true, // Persist pending changes and retry
  },
  retry: {
    infinite: true, // Retry changes with exponential backoff
    backoff: 'exponential',
  },
})

export const initializeLegendState = () => {
  // Any additional initialization logic can go here
  console.log('Legend State initialized on native')
}
