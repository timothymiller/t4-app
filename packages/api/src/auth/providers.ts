// Note this file is isomorphic so it doesn't import back-end lucia code
import type {
  Apple,
  AppleTokens,
  Discord,
  DiscordTokens,
  GitHub,
  GitHubTokens,
  GoogleTokens,
} from 'arctic'
import { Google } from 'arctic'

export const providers: {
  apple: Apple | null
  discord: Discord | null
  github: GitHub | null
  google: Google | null
} = {
  apple: null,
  discord: null,
  github: null,
  google: null,
}
export type AuthProviderName = keyof typeof providers
export type AuthProvider = Apple | Discord | GitHub | Google
export type AuthTokens = AppleTokens | DiscordTokens | GitHubTokens | GoogleTokens
export type AuthProviderWithPKCE = Google
export type AuthProviderWithoutPKCE = Exclude<AuthProvider, AuthProviderWithPKCE>

export const isAuthProviderName = (name: string): name is AuthProviderName => {
  return name in providers
}

export const isOAuth2ProviderWithPKCE = (
  provider: AuthProvider
): provider is AuthProviderWithPKCE => {
  return provider instanceof Google
}
