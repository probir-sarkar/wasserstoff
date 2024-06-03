import { Router } from "express";
import { db } from "@/configs/db";
import { createToken, allTokens, addRoutes } from "@/controllers/route-controller";

const api = Router();

api.get("/route", async (req, res) => {
  const result = await db.query.token.findMany({
    with: {
      routes: true,
    },
  });
  res.json(result);
});
api.post("/route", addRoutes);

api.route("/token").get(allTokens).post(createToken);
export default api;
