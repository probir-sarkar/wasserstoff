import { RequestHandler } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { z } from "zod";

const testUrls = [{ testUrl1: ["http://localhost:3001", "http://localhost:3002"] }];

// const paramsSchema = z.object({
//   id: z.string(),
//   path: z.string().optional().default(""),
// });
// export const loadBalance: RequestHandler = async (req, res) => {
//   const { id, path } = paramsSchema.parse(req.params);

//   res.json({ message: "Test Route", method: req.method, id, path });
// };

const servers = ["http://localhost:4000", "http://localhost:4001", "http://localhost:4002"];
let currentServer = 0;

export const loadBalance: RequestHandler = async (req, res, next) => {
  const server = servers[currentServer];
  currentServer = (currentServer + 1) % servers.length;
  console.log(`Forwarding request to: ${server}`);
  createProxyMiddleware({ target: server, changeOrigin: true })(req, res, next);
};
