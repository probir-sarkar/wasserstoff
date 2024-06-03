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
  tokenId: z.number(),
  routes: z.array(
    z.object({
      url: z.string(),
      weight: z.number().optional(),
    })
  ),
});

export const addRoutes: RequestHandler = async (req, res) => {
  try {
    const { tokenId, routes: inComingRoutes } = addRoutesSchema.parse(req.body);
    const tokenData = await db.query.token.findFirst({
      where: (token, { eq }) => eq(token.id, tokenId),
    });
    if (!tokenData) {
      return res.status(404).send({ message: "Token not found" });
    }
    await db.delete(routes).where(eq(routes.tokenId, tokenId));
    await db.insert(routes).values(
      inComingRoutes.map((route) => ({
        ...route,
        tokenId,
      }))
    );
    res.status(201).send({ message: "Routes added successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to add routes", error });
  }
};
