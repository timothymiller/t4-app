import { string, object, parse, picklist, type Input } from 'valibot'

const envVariables = object({
    EAS_PROJECT_ID: string(),
    EAS_OWNER: string(),
    EXPO_NO_TELEMETRY: picklist(['true', 'false']),
})

parse(envVariables, process.env)

declare global {
    namespace NodeJS {
        interface ProcessEnv extends Input<typeof envVariables> {}
    }
}
