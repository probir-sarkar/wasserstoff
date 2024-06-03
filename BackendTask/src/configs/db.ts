import env from "@/env";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@/db/schema";
const client = createClient({
  url: env.dbUrl,
  authToken: env.dbAuthToken,
});

export const db = drizzle(client, { schema });
