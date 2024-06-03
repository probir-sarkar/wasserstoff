import express, { Express } from "express";
import env from "@/env";
import cors from "cors";
import { errorHandler } from "@/middlewares/errorHandler";
import { loadBalance } from "./controllers/load-balance";
import api from "./routes/api";

const app: Express = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api", api);
app.use((req, res, next) => {
  console.log(`Received request for: ${req.url}`);
  next();
});
app.use(loadBalance);

// Route not found handler, must be the last route and before the global error handler, It will handle all routes that are not found
app.all("*", (req, res) => res.status(404).json({ message: "Route not found" }));

// Global error handler, must be the last middleware, It will handle all errors
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});
