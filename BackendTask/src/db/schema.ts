import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const token = sqliteTable("token", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  healthRoute: text("healthRoute"),
  token: text("token").notNull(),
});

export const routes = sqliteTable("routes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  url: text("url").notNull(),
  weight: integer("weight").notNull(),
  tokenId: integer("tokenId")
    .notNull()
    .references(() => token.id),
});
export const tokenRelations = relations(token, ({ many }) => ({
  routes: many(routes),
}));
export const routesRelations = relations(routes, ({ one }) => ({
  token: one(token, {
    fields: [routes.tokenId],
    references: [token.id],
  }),
}));
