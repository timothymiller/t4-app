// Note this file is isomorphic so it doesn't import back-end lucia code
import type {
  Apple,
  AppleTokens,
  Discord,
  DiscordTokens,
  GitHub,
  GitHubTokens,
  Google,
  GoogleTokens,
} from 'arctic'

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

export const isAuthProviderName = (name: string): name is AuthProviderName => {
  return name in providers
}
