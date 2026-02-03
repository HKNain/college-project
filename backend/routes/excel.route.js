import { Router } from "express";
import { parseExcelFile } from "../controllers/excel.controller.js";
import protectRoute from "../middlewares/protectAuthRoutes.js";
import { adminProtectRoute } from "../middlewares/adminProtectRoute.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = Router();

router.post(
  "/parse",
  protectRoute,
  adminProtectRoute,
  upload.single("file"),
  parseExcelFile
);

export default router;