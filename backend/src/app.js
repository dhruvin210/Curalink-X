import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import routes from "./routes/index.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl
  })
);
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 60
  })
);

app.use("/api", routes);

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message =
    env.nodeEnv === "production" && status === 500
      ? "Unexpected server error."
      : error.message || "Unexpected server error.";

  res.status(status).json({
    message,
    issues: error.issues || undefined
  });
});
