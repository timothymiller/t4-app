/**
 * TODO: This is a WIP. The goal is to have a single source of truth for all environment variables.
 * Different prefixes for public environments across Expo & Next.js currently block this.
 */

import { object, parse, string } from 'valibot'

const envSchema = object({
  NODE_ENV: string(),
  // Routing
  NEXT_PUBLIC_API_URL: string(),
  NEXT_PUBLIC_APP_URL: string(),
  // Authentication
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string(),
  NEXT_PUBLIC_SUPABASE_URL: string(),
  JWT_VERIFICATION_KEY: string(),
  // Customer Support
  NEXT_PUBLIC_SUPPORT_EMAIL: string(),
  // Tamagui Debug
  TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD: string(),
  TAMAGUI_TARGET: string(),
  // Web Metadata
  NEXT_PUBLIC_METADATA_NAME: string(),
})

export const env = parse(envSchema, process.env)
