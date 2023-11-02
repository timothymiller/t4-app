const createEnv = require('@t3-oss/env-core').createEnv;
const z = require("zod").z;

const dotenv = require('dotenv');
dotenv.config()

module.exports = createEnv({
  server: {
    EAS_OWNER: z.string().min(1),
    EAS_PROJECT_ID: z.string().min(1),
    EAS_SLUG: z.string().min(1),
    EXPO_NO_TELEMETRY: z.enum(["true", "false"]).transform((value) => value === "true")
  },
  runtimeEnvStrict: {
    EAS_OWNER: process.env.EAS_OWNER,
    EAS_PROJECT_ID: process.env.EAS_PROJECT_ID,
    EAS_SLUG: process.env.EAS_SLUG,
    EXPO_NO_TELEMETRY: process.env.EXPO_NO_TELEMETRY
  },
});