import { Router } from "express";
import { getTeachersList } from "../controllers/teacher.controller";

const router = Router();

router.get("/getTeachers", getTeachersList);

export default router;
