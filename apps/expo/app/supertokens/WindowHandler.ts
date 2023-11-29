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
      // The getHostName function, utilized by supertokens-website to obtain the defaultSessionScope for the sessionToken, returns 'localhost'. This is acceptable as cookies are stored using our own storageHandler.
      getHostName() {
        return 'localhost'
      },
    },
  }
}
