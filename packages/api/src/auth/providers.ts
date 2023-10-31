// Note this file is isomorphic so it doesn't import back-end lucia code
import type { AppleAuth, DiscordAuth, GoogleAuth } from "@lucia-auth/oauth/providers"

export const providers: {
  apple: AppleAuth | null,
  discord: DiscordAuth | null,
  google: GoogleAuth | null,
} = {
  apple: null,
  discord: null,
  google: null,
}
export type AuthProviderName = keyof typeof providers

export const isAuthProviderName = (name: string): name is AuthProviderName => {
  return name === 'apple' || name === 'discord' || name === 'google'
}
