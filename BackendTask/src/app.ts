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

app.use("/:id", loadBalance);

// Route not found handler, must be the last route and before the global error handler, It will handle all routes that are not found
app.all("*", (req, res) => res.status(404).json({ message: "Route not found" }));

// Global error handler, must be the last middleware, It will handle all errors
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});

// For testing purpose
const test: Express = express();
test.get("/", (req, res) => res.send("Hello World!"));
test.get("/health", (req, res) => res.send("OK"));
const ports = [4000, 4001, 4002, 4003, 4004, 4005, 4006, 4007, 4008, 4009];
ports.forEach((port) => {
  test.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
