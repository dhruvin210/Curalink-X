import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      console.log(`Curalink X API listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start Curalink X API", error);
    process.exit(1);
  }
};

startServer();
