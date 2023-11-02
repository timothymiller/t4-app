import { optional, string, url, object, parse, type Input } from 'valibot'

const envVariables = object({
    NEXT_PUBLIC_APP_URL: string([url()]),
    NEXT_PUBLIC_SUPPORT_EMAIL: optional(string()),
    NEXT_PUBLIC_METADATA_NAME: string(),
    NEXT_PUBLIC_METADATA_DESCRIPTION: string(),
    NEXT_PUBLIC_METADATA_URL: string([url()]),
    JWT_VERIFICATION_KEY: optional(string()),
})

export default parse(envVariables, process.env)

declare global {
    namespace NodeJS {
        interface ProcessEnv extends Input<typeof envVariables> {}
    }
}
