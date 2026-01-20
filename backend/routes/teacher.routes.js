import { Router } from "express";
import {
  getTeachersList,
  sendStudentMarks,
  sendTeacherMail,
} from "../controllers/teacher.controller.js";
import protectRoute from "../middlewares/protectAuthRoutes.js";

const router = Router();

// Get all teachers (can be public or protected based on your needs)
router.get("/getTeachers", getTeachersList);

// Send assignment emails to teachers (admin only)
router.post("/sendTeachersEmail", protectRoute, sendTeacherMail);

// Submit student marks (teacher only)
router.post("/submitMarks", protectRoute, sendStudentMarks);

export default router;
