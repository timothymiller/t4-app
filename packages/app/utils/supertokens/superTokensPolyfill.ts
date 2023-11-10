// The supertokens-website library relies on global functions atob and escape that are not available in React Native. 
// We temporarily resolved this by adding the following polyfill. 
// Removal can be done once this line is updated: https://github.com/supertokens/supertokens-website/blob/master/lib/ts/fetch.ts#L843.
import { decode as atob, encode as btoa } from 'base-64'

if (!global.btoa) {
  global.btoa = btoa
}

if (!global.atob) {
  global.atob = atob
}

if (!global.escape) {
  global.escape = global.encodeURIComponent
}
