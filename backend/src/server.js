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

const logFatalError = (label, error) => {
  console.error(label, JSON.stringify(serializeError(error), null, 2));
};

process.on("unhandledRejection", (reason) => {
  logFatalError("Unhandled promise rejection", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  logFatalError("Uncaught exception", error);
  process.exit(1);
});

const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing.");
    }

    const [{ app }, { connectDatabase }] = await Promise.all([
      import("./app.js"),
      import("./config/db.js")
    ]);

    await connectDatabase();
    app.listen(env.port, () => {
      console.log(`Curalink X API listening on port ${env.port}`);
    });
  } catch (error) {
    logFatalError("Failed to start Curalink X API", error);
    process.exit(1);
  }
};

startServer();
