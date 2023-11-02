import { optional, string, url, object, parse, type Input } from 'valibot'

const envVariables = object({
    NEXT_PUBLIC_APP_URL: string([url()]),
    NEXT_PUBLIC_API_URL: string([url()]),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string(),
    NEXT_PUBLIC_SUPABASE_URL: string([url()]),
    NEXT_PUBLIC_SUPPORT_EMAIL: optional(string()),
})

parse(envVariables, process.env)

declare global {
    namespace NodeJS {
        interface ProcessEnv extends Input<typeof envVariables> {}
    }
}
