import {
  InferInput,
  email as emailValidator,
  picklist,
  minLength,
  object,
  optional,
  string,
  toLowerCase,
  trim,
  pipe,
} from 'valibot'
import { AuthProviderName } from '../auth/providers'

const email = pipe(
  string('Email address is required.'),
  trim(),
  minLength(1, 'Email address is required.'),
  toLowerCase(),
  emailValidator('The email address is invalid.')
)
const optionalEmail = optional(
  pipe(
    string('The email address is invalid.'),
    trim(),
    toLowerCase(),
    emailValidator('The email address is invalid.')
  )
)

const password = optional(pipe(string(), minLength(1, 'Password is required.')))
const optionalPassword = optional(string())

const authProviders: [AuthProviderName, ...AuthProviderName[]] = ['apple', 'discord', 'google']
const authProvidersInput = picklist(authProviders)

export const SignInSchema = object({
  password: optionalPassword,
  email: optionalEmail,
  code: optional(string()), // for password-less sign in
  provider: optional(authProvidersInput),
  state: optional(string()), // to compare to http-only cookie set before 3rd party redirect
  redirectTo: optional(string()),
  // The following params are used with apple sign-in on native
  // On web, http-only cookies should be used
  accessToken: optional(string()),
  idToken: optional(string()),
  refreshToken: optional(string()),
  nonce: optional(string()),
  appleUser: optional(object({ email: optionalEmail })),
})

export type InferInput = InferInput<typeof SignInSchema>

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
