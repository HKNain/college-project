import { Router } from "express";
import { loginValidation, signUpValidation, } from "../utils/validationAuth.js";
import { handleLogin, handleSignup, } from "../controllers/auth.controller.js";
const router = Router();

router.post("/signup", signUpValidation, handleSignup);
// router.patch("/signup/username", signUpValidationForUserName, handleSignupUserName);
router.post("/login",loginValidation, handleLogin);



export default router;