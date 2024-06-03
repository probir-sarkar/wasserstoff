import { Router } from "express";
import { db } from "@/configs/db";
import { createToken, allTokens, addRoutes, getTokenById } from "@/controllers/route-controller";
import { tryCatch } from "@/utils";

const api = Router();

api.get("/route", async (req, res) => {
  const result = await db.query.token.findMany({
    with: {
      routes: true,
    },
  });
  res.json(result);
});

api.route("/token").get(tryCatch(allTokens)).post(tryCatch(createToken)).put(tryCatch(addRoutes));
api.route("/token/:id").get(tryCatch(getTokenById));
export default api;
