import { RequestHandler } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { db } from "@/configs/db";
import { redis } from "@/configs/redis";

async function currentIndex(id: number) {
  const index = await redis.get(`index:${id}`);
  if (index) return +index;
  await redis.set(`index:${id}`, 0);
  return 0;
}
async function updateIndex(id: number, servers: any[]) {
  const index = await currentIndex(id);
  const newIndex = (index + 1) % servers.length;
  await redis.set(`index:${id}`, newIndex);
  return newIndex;
}

export const loadBalance: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  if (!id || id === "") return res.status(400).json({ message: "Id is required" });
  const token = await verifyIncoming(id);
  if (!token) return res.status(400).json({ message: "Invalid token" });
  const servers = token.routes;
  const index = await currentIndex(token.id);
  const server = servers[index];
  if (!server) return res.status(500).json({ message: "No available servers" });
  updateIndex(token.id, servers);
  console.log(`Forwarding request to: ${server.url}`);
  createProxyMiddleware({ target: server.url, changeOrigin: true })(req, res, next);
};

const verifyIncoming = async (id: string) => {
  try {
    const cachedToken = await redis.get(`token:${id}`);
    if (cachedToken) {
      return JSON.parse(cachedToken);
    } else {
      const getToken = await db.query.token.findMany({
        with: {
          routes: true,
        },
        where: (token, { eq }) => eq(token.id, +id),
      });
      if (getToken.length === 0) return false;
      const token = getToken[0];
      await redis.set(`token:${id}`, JSON.stringify(token));
      return token;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
