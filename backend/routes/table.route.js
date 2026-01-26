import { Router } from "express";
import { handleCreatedNewTable, deleteExistingTable, editTable ,getTable  } from "../controllers/table.controller.js";
import protectRoute from "../middlewares/protectAuthRoutes.js";
import { adminProtectRoute } from "../middlewares/adminProtectRoute.js";
import { branchCreateValidation ,editBranchValidation} from "../utils/validationAuth.js";


const router = Router();




router.post("/createTable", handleCreatedNewTable);
router.patch("/editTable", editTable);
router.delete("/deleteTable",deleteExistingTable);
router.post("/getTable", getTable);


export default router;