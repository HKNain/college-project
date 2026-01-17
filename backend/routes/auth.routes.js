import { Router } from "express";
import { loginValidation, signUpValidation, } from "../utils/validationAuth.js";
import { handleLogin, handleSignupEmail,handleSignupUserName } from "../controllers/auth.controllers.js";
const router = Router();

router.post("/signup", signUpValidation, handleSignupEmail);
// router.patch("/signup/username", signUpValidationForUserName, handleSignupUserName);
router.post("/login",loginValidation, handleLogin);



export default router;