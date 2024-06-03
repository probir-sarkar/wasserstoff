import { db } from "@/configs/db";
import { token } from "@/db/schema";
import { createId } from "@paralleldrive/cuid2";
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
  const result = await db.query.token.findMany({
    with: {
      routes: true,
    },
  });
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

// export const addRoute: RequestHandler = async (req, res) => {
//   const { url, weight, tokenId } = req.body;
//   const result = await db.query.routes.insert({
//     url,
//     weight,
//     tokenId,
//   });
//   res.json(result);
// };
