import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";

const serializeError = (error) => ({
  name: error?.name,
  message: error?.message,
  code: error?.code,
  codeName: error?.codeName,
  stack: error?.stack,
  cause:
    typeof error?.cause === "object" && error?.cause !== null
      ? {
          name: error.cause.name,
          message: error.cause.message,
          code: error.cause.code,
          codeName: error.cause.codeName
        }
      : error?.cause
});

const startServer = async () => {
  try {
    if (!env.mongoUri) {
      throw new Error("MONGODB_URI is missing.");
    }

    await connectDatabase();
    app.listen(env.port, () => {
      console.log(`Curalink X API listening on port ${env.port}`);
    });
  } catch (error) {
    console.error(
      "Failed to start Curalink X API",
      JSON.stringify(serializeError(error), null, 2)
    );
    process.exit(1);
  }
};

startServer();
