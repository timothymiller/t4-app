import {
  Input,
  email as emailValidator,
  enumType,
  minLength,
  object,
  optional,
  string,
  toLowerCase,
  toTrimmed
} from 'valibot'
import type { AuthProviderName } from '../auth/shared'
import type { User as SessionUser } from 'lucia'
import type { User } from '../db/schema'

export function isSessionUser(user: User | SessionUser): user is SessionUser {
  return !!(user as SessionUser).userId
}

export function isUser(user: User | SessionUser): user is User {
  return !!(user as User).id
}

const email = string('Email address is required.', [
  toTrimmed(),
  minLength(1, 'Email address is required.'),
  toLowerCase(),
  emailValidator('The email address is invalid.'),
])
const optionalEmail = optional(
  string('The email address is invalid.', [
    toTrimmed(),
    toLowerCase(),
    emailValidator('The email address is invalid.'),
  ])
)

const password = optional(string([minLength(1, 'Password is required.')]))
const optionalPassword = optional(string())

const authProviders: [AuthProviderName, ...AuthProviderName[]] = ['apple', 'discord', 'google']
const authProvidersInput = enumType(authProviders)

export const SignInSchema = object({
  password: optionalPassword,
  email: optionalEmail,
  code: optional(string()), // for password-less sign in
  provider: optional(authProvidersInput),
  redirectTo: optional(string()),
  // Used with apple sign-in on native
  token: optional(string()),
  nonce: optional(string()),
})

export type SignInInput = Input<typeof SignInSchema>

export const CreateUserSchema = object({
  email,
  password,
})

export const EditUserSchema = object({
  id: string(),
  email,
})

export const EditProfileSchema = object({
  email,
  password: optionalPassword,
})

export const SetPasswordSchema = object({
  authMethodId: string(),
  userId: string(),
  password: optionalPassword,
})
