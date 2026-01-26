import { Router } from "express";
import { handleCreatedNewTable, deleteExistingTable, editTable ,getTable  } from "../controllers/table.controller.js";
import protectRoute from "../middlewares/protectAuthRoutes.js";
import { adminProtectRoute } from "../middlewares/adminProtectRoute.js";
import { branchCreateValidation ,editBranchValidation} from "../utils/validationAuth.js";


const router = Router();




router.post("/createTable", protectRoute, adminProtectRoute, branchCreateValidation, handleCreatedNewTable);
router.patch("/editTable", protectRoute, editBranchValidation, editTable);
router.delete("/deleteTable", protectRoute, adminProtectRoute, deleteExistingTable);
router.post("/getTable", protectRoute, getTable);


export default router;