import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwtToken.js";
import User from "../models/user.model.js";

// TODO 2. token blacklisting kr saare !!
// TODO 4. forget Password
// TODO 5. rate limit
// TODO 6. is_it_Human
// TODO 7. chnage in auth section protctRoute adminRinprotect valida
// TODO Secure tokens and authorization make it comletely secure since handlSignup Can be done  by anyone and also for login too

// !Warning :
// 1. Do every checks for tokens

export const handleSignup = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", flag: false });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    return res.status(201).json({ flag: true });
  } catch (error) {
    console.log(" error in handleSingupEmail  ", error);
    return res.status(500).json({
      message: "Internal server error  Account Not Created !",
      flag: false,
    });
  }
};

export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    let existingUser = "";
    if (email)
      existingUser = await User.findOne({ email }).select("+password +role");
    else
      return res
        .status(400)
        .json({ message: "Please put valid identifier", flag: false });

    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "No such account exist ", flag: false });
    }
    if (!comparePassword(password, existingUser.password)) {
      return res
        .status(400)
        .json({ message: " Please enter valid password ", flag: false });
    }

    const token = generateToken(existingUser.id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "User logged in successfully",
      flag: true,
      user: {
        id: existingUser._id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.log(" error in handleLogin ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", flag: false });
  }
};
