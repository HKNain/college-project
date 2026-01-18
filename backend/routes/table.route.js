import { Router } from "express";
import { handleCreatedNewTable, deleteExistingStudent, editExistingStudent } from "../controllers/table.controller";

const router = Router();
const adminProtectRoute = (req , res , next  )=>{

}



router.post("/createTable",protectRoute , adminProtectRoute , handleCreatedNewTable);
router.patch("/editTable", protectRoute ,adminProtectRoute ,editExistingStudent);
router.delete("/editDelete", protectRoute ,adminProtectRoute ,deleteExistingStudent);


// TODO add here admin can only d this check 
export default router;