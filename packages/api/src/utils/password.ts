import { argon2Hash, argon2Verify } from './password/argon2'
import { HashMethod } from './password/hash-methods'
import { LegacyScrypt } from 'lucia'

export async function hashPassword(password: string) {
  const hashedPassword = await argon2Hash(password)
  return {
    hashedPassword,
    hashMethod: 'argon2' as HashMethod,
  }
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
  hashMethod: HashMethod | null | undefined = 'scrypt'
) {
  switch (hashMethod) {
    case 'scrypt':
    case null:
    case undefined:
      return await new LegacyScrypt().verify(hashedPassword, password)
    case 'argon2':
      return await argon2Verify(password, hashedPassword)
    default:
      throw new Error(`Unknown hash method: ${hashMethod}`)
  }
}
