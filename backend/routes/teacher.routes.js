import { Router } from "express";
import {
  getTeachersList,
  sendStudentMarks,
  sendTeacherMail,
} from "../controllers/teacher.controller.js";
import protectRoute from "../middlewares/protectAuthRoutes.js";
import { adminProtectRoute } from "../middlewares/adminProtectRoute.js";

const router = Router();

router.get("/getTeachers", protectRoute, getTeachersList);

router.post("/sendTeachersEmail",protectRoute, adminProtectRoute,  sendTeacherMail);

router.post("/submitMarks",protectRoute, sendStudentMarks);

export default router;
