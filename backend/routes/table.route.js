import { Router } from "express";
import { handleCreatedNewTable, deleteExistingTable, editTable ,getTable  } from "../controllers/table.controller.js";
import protectRoute from "../middlewares/protectAuthRoutes.js";
import { adminProtectRoute } from "../middlewares/adminProtectRoute.js";


const router = Router();




router.post("/createTable",protectRoute  ,adminProtectRoute , handleCreatedNewTable);
router.patch("/editTable", protectRoute  ,adminProtectRoute,editTable);
router.delete("/DeleteTable", protectRoute,adminProtectRoute  ,deleteExistingTable);
router.delete("/getTable", protectRoute,adminProtectRoute  ,getTable);


export default router;