import { generateRandomString } from 'lucia/utils'

/**
 * Generates an ID to use for database records.
 *
 * It uses generateRandomString from lucia which uses NanoId
 * under the hood. It uses abcdefghijklmnopqrstuvwxyz1234567890
 * for the alphabet instead of the full nanoid list. It also defaults
 * to 16 chars instead of 21. So the chances of collisions are probably
 * higher than nanoid.
 *
 * If this is a problem, you could import nanoid directly
 * and use the default ID that it generates. Or you could
 * use @paralleldrive/cuid2 which has put a lot of thought into generating IDs.
 * See https://github.com/paralleldrive/cuid2#the-contenders
 * Note Cuid2 might need a polyfill for React Native.
 * https://github.com/paralleldrive/cuid2#troubleshooting
 */
export function createId() {
  return generateRandomString(16)
}

export function createToken() {
  return generateRandomString(63)
}

const codeChars = '0123456789'

export function createCode(size = 6) {
  return generateRandomString(size, codeChars)
}
