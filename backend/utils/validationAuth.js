
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const signUpAllowedFieldForEmailValidation = [ "email", "password" ]
const signUpAllowedFieldForuserNameValidation = [ "userName", "firstName"]
const loginAllowedField = [ "identifier", "password" ]

function removeAllSpaces(str) {
  return str.replace(/\s+/g, "");
}


export const signUpValidation = async (req,res,next) =>{
  try {
        const {  email, password, firstName , lastName , role  } = req.body;

        signUpAllowedFieldForEmailValidation.forEach(field => {
            if (req.body[field] === undefined ){
                return res.status(400).json({
                message: {
                    field :  `This field ${field} is missing  `
                },
                flag : false
            });
            }
        });
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
        next() ;
        
    } catch (error) {
        console.error("SignupValidation error:", error);
        res.status(500).json({ message: "Internal server error" });
    }  
}



export const loginValidation = async (req, res , next) => {
    try {
        const { email, password  } = req.body;
       
        loginAllowedField.forEach(field => {
            if (req.body[field] === undefined){
                return res.status(400).json({
                message: {
                    field :  `This field ${field} is missing  `
                }
            });
            }
        });
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