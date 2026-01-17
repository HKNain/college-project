import { Router } from "express";
import { createNewStudent, deleteExistingStudent, editExistingStudent } from "../controllers/student.controller";

const router = Router();

router.post("/createStudent", createNewStudent);
router.patch("/editStudent", editExistingStudent);
router.delete("/deleteStudent", deleteExistingStudent);

export default router;