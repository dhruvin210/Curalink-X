import { Router } from "express";
import researchRoutes from "./research.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Curalink X API"
  });
});

router.use("/research", researchRoutes);

export default router;
