import { db } from "@/configs/db";
import { token, routes } from "@/db/schema";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { RequestHandler } from "express";
import { z } from "zod";

export const allRoutes: RequestHandler = async (req, res) => {
  const result = await db.query.routes.findMany({
    with: {
      token: true,
    },
  });
  res.json(result);
};

export const allTokens: RequestHandler = async (req, res) => {
  // const result = await db.select().from(token).rightJoin(routes, eq(token.id, routes.tokenId));
  const result = await db.query.token.findMany();
  res.json(result);
};

export const getTokenById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const result = await db.query.token.findFirst({
    where: (token, { eq }) => eq(token.id, +id),
    with: {
      routes: true,
    },
  });
  if (!result) {
    return res.status(404).send({ message: "Token not found" });
  }
  res.json(result);
};
const createTokenSchema = z.object({
  name: z.string().min(3),
  healthRoute: z.string(),
});
export const createToken: RequestHandler = async (req, res) => {
  try {
    const { name, healthRoute } = createTokenSchema.parse(req.body);
    await db.insert(token).values({
      name,
      healthRoute,
      token: createId(),
    });

    res.status(201).send({ message: "Token created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to create token", error });
  }
};

const addRoutesSchema = z.object({
  id: z.number(),
  name: z.string().min(3),
  healthRoute: z.string().min(3),
  token: z.string(),
  routes: z.array(
    z.object({
      url: z.string().min(1),
      weight: z.number().optional().default(1),
    })
  ),
});

export const addRoutes: RequestHandler = async (req, res) => {
  try {
    const { id, routes: inComingRoutes, name, healthRoute } = addRoutesSchema.parse(req.body);
    const tokenData = await db.query.token.findFirst({
      where: (token, { eq }) => eq(token.id, id),
    });
    if (!tokenData) {
      return res.status(404).send({ message: "Token not found" });
    }
    await db.transaction(async (trx) => {
      await trx
        .update(token)
        .set({
          name,
          healthRoute,
        })
        .where(eq(token.id, id));
      await trx.delete(routes).where(eq(routes.tokenId, id));
      await trx.insert(routes).values(
        inComingRoutes.map((route) => ({
          ...route,
          tokenId: id,
        }))
      );
    });
    res.status(201).send({ message: "Routes added successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to add routes", error });
  }
};
