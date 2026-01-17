import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { generateToken, verifyToken } from "../utils/jwtToken.js";
import User from "../models/user.models.js";
import { nanoid } from "nanoid";


// TODO 1. userName should be checked like is it correct one 
// TODO 2. token blacklisting kr saare !!  
// TODO 3. Google Auth  
// TODO 4. forget Password 
// TODO 5. rate limit  
// TODO 6. is_it_Human  
  

// !Warning :
// 1. Do every checks for tokens    



// TODO he after again he comes back then he will reach diresctly to that 
const checkToken = (res,SignupPayload)=>{
    const decoded = verifyToken(SignupPayload);
    return decoded ;
}
const createSignupLoginToken = (id,res,tokenName)=>{

    const payload = {
        userId : id
    } // payload is send just bcz I need to do then signUpfor Name so to connect with that its is needed 
    const signUpToken = generateToken(payload)
    res.cookie(tokenName,signUpToken,{
        httpOnly : true ,
        maxAge : 10*60*1000 ,
        sameSite : 'strict'
    })
}

export const handleSignupEmail = async (req, res) => {
    try {

// TODO A mail will be shown that u have created an acc 
        const {email, password ,firstName , lastName , role  } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
             return res.status(400).json({ message: "User already exists" , flag : false  });
        }

        const hashedPassword = await hashPassword(password);
        
        const newUser = new User({ firstName, lastName ,  email, password: hashedPassword, role  });
        await newUser.save();

        return res.status(201).json({flag : true });

        
    } catch (error) {
        console.log(" error in handleSingupEmail  ", error)
        return res.status(500).json({ message: "Internal server error  Account Not Created !" , flag : false });
    }
};



export const handleLogin = async (req, res) => {
    try {
        // if payload then just login up thats it just login the user ...
        // TODO see for autoLogin
            const {email , password } = req.body;
            
            let existingUser =""
            if  (email) existingUser = await User.findOne({ email }).select("+password");
            else return res.status(400).json({message:"Please put valid identifier",flag : false })

            if (!existingUser){
                return res.status(400).json({message:"No such account exist ",flag : false })   
            }
            if (!comparePassword(password,existingUser.password)){
                return res.status(400).json({message : " Please enter valid password ", flag : false })
            }

            generateToken(existingUser>)

        

        return res.status(200).json({ message: "User Login up  successfully" });
    } catch (error) {
        console.log(" erorr in handleLogin ", error)
        return res.status(500).json({ message: "Internal server error" });
    }
};