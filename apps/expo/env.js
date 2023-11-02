const createEnv = require('@t3-oss/env-core').createEnv;
const z = require("zod").z;

const dotenv = require('dotenv');
dotenv.config()

module.exports = createEnv({
  skipValidation: process.env.EAS_BUILD_RUNNER === "eas-build",
  server: {
    EAS_OWNER: z.string().min(1),
    EAS_PROJECT_ID: z.string().min(1),
    EXPO_NO_TELEMETRY: z.enum(["true", "false"]).transform((value) => value === "true")
  },
  runtimeEnvStrict: {
    EAS_OWNER: process.env.EAS_OWNER,
    EAS_PROJECT_ID: process.env.EAS_PROJECT_ID,
    EXPO_NO_TELEMETRY: process.env.EXPO_NO_TELEMETRY
  },
});