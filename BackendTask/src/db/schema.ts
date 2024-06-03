import { relations } from "drizzle-orm";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { table } from "console";

export const token = sqliteTable("token", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  healthRoute: text("health_route"),
  token: text("token")
    .notNull()
    .$defaultFn(() => createId()),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
});

export const routes = sqliteTable(
  "routes",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    url: text("url").notNull(),
    weight: integer("weight").notNull().default(1),
    tokenId: integer("tokenId")
      .notNull()
      .references(() => token.id, { onDelete: "cascade" }),
  },
  (table) => ({
    uniqueTokenUrl: unique().on(table.tokenId, table.url),
  })
);
export const tokenRelations = relations(token, ({ many }) => ({
  routes: many(routes),
}));
export const routesRelations = relations(routes, ({ one }) => ({
  token: one(token, {
    fields: [routes.tokenId],
    references: [token.id],
  }),
}));
