
import { securityKeyCheck } from "./securityKeyCheckUp.js";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const signUpAllowedFieldValidation = [ "email", "password","firstName","lastName","role", "securityKey" ]
const loginAllowedField = [ "identifier", "password" ]
const branchCreateAllowedField = ["year","branch","totalStudents","data"]


function removeAllSpaces(str) {
  return str.replace(/\s+/g, "");
}
// TODO check issues for lastName 


function checker (fieldsNameValidationBox , req , res ) {
    const missingField = fieldsNameValidationBox.find(
        field => !(field in req.body) || req.body[field] ===undefined
    )   
    if (missingField){
        const missingFieldMessage = missingField.map((field)=>{
            `${field} is missing `
        })
        return res.status(400).json({
            message : missingFieldMessage ,
            flag : false 
        })
    }
   

    if ( Object.keys(req.body).length !== fieldsNameValidationBox.length){
        return res.status(400).json({message : {
            field : "You are not allowed to add multiple fields "
        } , flag : false} )
    } 
}


export const signUpValidation = async (req,res,next) =>{
  try {
        const {  email, password, firstName , lastName , role , securityKey } = req.body;

        checker( signUpAllowedFieldValidation, req , res )



        email = email.toLowerCase();
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Email must be a valid email address" ,flag : false});
        }
        password =removeAllSpaces(password)
        if (password.length < 6 || password.length > 30) {
            return res.status(400).json({ message: "Password must be between 6 and 30 characters ",flag : false });
        }
        
        if (firstName.trim().length==0|| firstName.trim().length>30) {
            return res.status(400).json({ message: "FirstName should have charachter between 1 to 30 " });
        }
        if (lastName!==undefined &&(lastName.trim().length ===0 || lastName.trim().length > 30)) {
            return res.status(400).json({ message: "lastName should have charachter between 1 to 30 " });
        }
        if (role !== "Admin" || role !=="Professor"){
            return res.status(400).json({ message: "Please enter valid role" });
        }
        securityKeyCheck(securityKey)
        next() ;
        
    } catch (error) {
        console.error("SignupValidation error:", error);
        res.status(500).json({ message: "Internal server error" });
    }  
}



export const loginValidation = async (req, res , next) => {
    try {
        const { email, password  } = req.body;
       
        checker(loginAllowedField , req , res )
        email = email.toLowerCase();
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Email must be a valid email address" ,flag : false});
        }

        password = removeAllSpaces(password)
        if (password.length < 6 || password.length > 30) {
            return res.status(400).json({ message: "Password must be between 6 and 30 characters" });
        }
        next() ;
        
    } catch (error) {
        console.error("LoginValidation error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const branchCreateValidation = (req , res , next ) => {
       checker( branchCreateAllowedField,req, res )
    
    if (typeof(year)!==String || typeof(branch)!=String || typeof(totalStudents)!=Number || typeof(data)!=Array   ){
            return res.status(400).json({message : {
                field : "Please fill exact values "
            } , flag : false} )
    }
    next()
}