import { generateRandomString, alphabet } from 'oslo/crypto'

export const idAlphabet = alphabet('a-z', '0-9')
export const codeAlphabet = '0123456789'

/**
 * Generates an ID to use for database records.
 *
 * Alternately, you could use @paralleldrive/cuid2
 * which has put a lot of thought into generating IDs.
 * See https://github.com/paralleldrive/cuid2#the-contenders
 * Note that Cuid2 might need a polyfill for React Native.
 * https://github.com/paralleldrive/cuid2#troubleshooting
 */
export function createId() {
  return generateRandomString(16, idAlphabet)
}

export function createToken() {
  return generateRandomString(63, alphabet('a-z', '0-9', '-', '_', 'A-Z'))
}
