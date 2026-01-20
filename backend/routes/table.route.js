import { Router } from "express";
import { handleCreatedNewTable, deleteExistingTable, editTable } from "../controllers/table.controller.js";
import protectRoute from "../middlewares/protectAuthRoutes.js";

const router = Router();
// const adminProtectRoute = (req , res , next  )=>{

// }



router.post("/createTable",protectRoute  , handleCreatedNewTable);
router.patch("/editTable", protectRoute  ,editTable);
router.delete("/editDelete", protectRoute  ,deleteExistingTable);


// TODO add here admin can only d this check 
export default router;