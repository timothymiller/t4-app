import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
 
export const env = createEnv({
  server: {
    JWT_VERIFICATION_KEY: z.string().optional(),
  },
  clientPrefix: "NEXT_PUBLIC_",
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_SUPPORT_EMAIL: z.string().optional(),
    NEXT_PUBLIC_METADATA_NAME: z.string(),
    NEXT_PUBLIC_METADATA_DESCRIPTION: z.string(),
    NEXT_PUBLIC_METADATA_URL: z.string().url(),
  },
  runtimeEnvStrict: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
    NEXT_PUBLIC_METADATA_NAME: process.env.NEXT_PUBLIC_METADATA_NAME,
    NEXT_PUBLIC_METADATA_DESCRIPTION: process.env.NEXT_PUBLIC_METADATA_DESCRIPTION,
    NEXT_PUBLIC_METADATA_URL: process.env.NEXT_PUBLIC_METADATA_URL,
    JWT_VERIFICATION_KEY: process.env.JWT_VERIFICATION_KEY
  },
});