import { TimeSpan, isWithinExpirationDate } from 'oslo'
import { TOTPController } from 'oslo/otp'
import { decodeBase64, encodeBase64, encodeHex } from 'oslo/encoding'
import { type JWT, parseJWT, validateJWT } from './jwt'
import { match, P } from 'ts-pattern'
import { HMAC, sha256 as sha256AB } from 'oslo/crypto'

const totpControllers: Record<number, TOTPController> = {}

function getTotpController({ seconds = 30 }: { seconds?: number } = {}) {
  if (!(seconds in totpControllers)) {
    // default is 6 digits, 30 seconds
    // https://oslo.js.org/reference/otp/TOTPController/
    totpControllers[seconds] = new TOTPController({
      digits: 6,
      period: new TimeSpan(seconds, 's'),
    })
  }
  return totpControllers[seconds] as TOTPController
}

export async function createTotpSecret() {
  return encodeBase64(await new HMAC('SHA-1').generateKey())
}

export function decodeTotpSecret(secret: string) {
  return decodeBase64(secret).buffer as ArrayBuffer
}

export interface TotpOptions {
  seconds?: number
  secret: string
}

export async function createCode({ seconds = 30, secret }: TotpOptions) {
  const totpController = getTotpController({ seconds })
  return await totpController.generate(decodeTotpSecret(secret))
}

export async function verifyCode(code: string, totpOptions: TotpOptions) {
  const totpController = getTotpController(totpOptions)
  return totpController.verify(code, decodeTotpSecret(totpOptions.secret))
}

/**
 * Returns a SHA-256 hex encoded hash of the input string.
 * Used with nonce verification with Sign in with Apple
 * Supabase also uses a SHA-256 hash for Apple nonce verification
 */
export async function sha256(input: string) {
  return encodeHex(await sha256AB(new TextEncoder().encode(input).buffer as ArrayBuffer))
}

export const isJWTExpired = (parsedJWT: JWT): boolean => {
  if (parsedJWT.expiresAt && !isWithinExpirationDate(parsedJWT.expiresAt)) {
    return true
  }
  if (parsedJWT.notBefore && Date.now() < parsedJWT.notBefore.getTime()) {
    return true
  }
  return false
}

export function textToArrayBuffer(text: string) {
  return Uint8Array.from(text.split('').map((x) => x.charCodeAt(0))).buffer as ArrayBuffer
}

export async function importHMACKey(key: string) {
  return textToArrayBuffer(key)
}

/**
 * Verifies the JWT and returns the payload if it is valid or null if it is not.
 *
 * The verification_key param can be a function to fetch the key from an external source.
 */
export async function verifyToken(
  token: string,
  verificationKey:
    | ArrayBuffer
    | string
    | JsonWebKey
    | ((decodedToken: JWT) => Promise<ArrayBuffer | string | JsonWebKey>)
) {
  const decodedToken = parseJWT(token)

  if (!decodedToken) {
    return null
  }

  const _verificationKey =
    typeof verificationKey === 'function' ? await verificationKey(decodedToken) : verificationKey

  const key = await match([decodedToken, _verificationKey])
    .returnType<Promise<ArrayBuffer>>()
    .with([{ algorithm: 'HS256' }, P.string], async ([_, key]) => await importHMACKey(key))
    .with(
      [P.any, P.intersection({}, P.not(P.instanceOf(ArrayBuffer)))],
      async ([decodedToken, key]) => {
        return (await crypto.subtle.exportKey(
          'spki',
          await crypto.subtle.importKey('jwk', key as JsonWebKey, decodedToken.algorithm, true, [
            'verify',
          ])
        )) as ArrayBuffer
      }
    )
    .otherwise(() => {
      throw new Error('Unhandled JWT verification key algorithm')
    })

  // It would be nice if oslo exported a way to validate a parsed JWT
  // rather than needing to pass a string token again
  const authorized = await validateJWT(decodedToken.algorithm, key, token)
  if (!authorized) {
    return null
  }

  return authorized
}
