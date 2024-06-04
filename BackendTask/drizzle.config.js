import env from "@/env";

import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: env.dbUrl,
    authToken: env.dbAuthToken,
  },
  verbose: true,
  strict: true,
});
