import env from "@/env";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({
  url: env.dbUrl,
  authToken: env.dbAuthToken,
});

export const db = drizzle(client);
