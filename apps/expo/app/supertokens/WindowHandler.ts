import { StorageHandler } from './StorageHandler'

export function windowHandler(original) {
  return {
    ...original,
    localStorage: new StorageHandler(),
    location: {
      ...original.location,
      getHref() {
        throw new Error('getHref is not implemented')
      },
      setHref(href) {
        throw new Error('setHref is not implemented')
      },
      getSearch() {
        throw new Error('getSearch is not implemented')
      },
      getHash() {
        throw new Error('getHash is not implemented')
      },
      getPathName() {
        throw new Error('getHash is not implemented')
      },
      getHostName() {
        // We are returning a dummy hostname to make supertokens happy
        return 'localhost'
      },
    },
  }
}
