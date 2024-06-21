import { configureObservableSync } from '@legendapp/state/sync'
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage'
import { enableReactComponents } from '@legendapp/state/config/enableReactComponents'

// Enable the Reactive components, only need to do this once
enableReactComponents()

// Setup global sync and persist configuration. These can be overriden
// per observable.

configureObservableSync({
  persist: {
    plugin: ObservablePersistLocalStorage,
    retrySync: true,
  },
  debounceSet: 500,
  retry: {
    infinite: true,
    backoff: 'exponential',
  },
})

export const initializeLegendState = () => {
  // Any additional initialization logic can go here
  console.log('Legend State initialized on web')
}
