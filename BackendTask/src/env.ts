import "dotenv/config";

import z from "zod";

const envSchema = z.object({
  port: z.number(),
  dbUrl: z.string(),
  dbAuthToken: z.string(),
});
const env = {
  port: process.env.PORT || 8080,
  dbUrl: process.env.DATABASE_URL,
  dbAuthToken: process.env.DATABASE_AUTH_TOKEN,
};

const parsedEnv = envSchema.parse(env);

export default parsedEnv;
