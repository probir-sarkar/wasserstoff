import { RequestHandler } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { z } from "zod";
import { db } from "@/configs/db";
import { eq } from "drizzle-orm";
import { routes, token } from "@/db/schema";

const testUrls = [{ testUrl1: ["http://localhost:3001", "http://localhost:3002"] }];

// const paramsSchema = z.object({
//   id: z.string(),
//   path: z.string().optional().default(""),
// });
// export const loadBalance: RequestHandler = async (req, res) => {
//   const { id, path } = paramsSchema.parse(req.params);

//   res.json({ message: "Test Route", method: req.method, id, path });
// };

// const servers = ["http://localhost:4000", "http://localhost:4001", "http://localhost:4002"];
let currentServer = 0;

export const loadBalance: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  if (!id || id === "") return res.status(400).json({ message: "Id is required" });
  const token = await verifyIncoming(id);
  if (!token) return res.status(400).json({ message: "Invalid token" });
  console.log(`Token: ${token}`);
  const servers = token.routes.map((route) => route.url);

  const server = servers[currentServer];
  currentServer = (currentServer + 1) % servers.length;
  console.log(`Forwarding request to: ${server}`);
  createProxyMiddleware({ target: server, changeOrigin: true })(req, res, next);
};

const verifyIncoming = async (id: string) => {
  try {
    const getToken = await db.query.token.findMany({
      with: {
        routes: true,
      },
      where: (token, { eq }) => eq(token.id, +id),
    });
    if (getToken.length === 0) return false;
    return getToken[0];
  } catch (error) {
    console.log(error);
    return false;
  }
};
